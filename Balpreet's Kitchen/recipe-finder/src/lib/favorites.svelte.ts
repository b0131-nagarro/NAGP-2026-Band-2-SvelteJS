import type { FavoriteEntry } from './types';

export interface FavoriteTarget {
	recipeId: string;
	recipeSource: 'mealdb' | 'local';
	title: string;
	image: string | null;
}

let entries = $state<FavoriteEntry[]>([]);
let loaded = false;

// One in-flight request per recipe, in click order. A heart is easy to
// double-click, and the POST and DELETE for the same recipe must not overtake
// each other — otherwise a "remove" can land after the "add" that came after it,
// leaving a filled heart on screen with nothing stored behind it. Both routes are
// idempotent, so running them in order means the last click wins on the server,
// which is the one the UI is already showing.
const inFlight = new Map<string, Promise<unknown>>();

function enqueue(recipeId: string, step: () => Promise<void>) {
	const chain = (inFlight.get(recipeId) ?? Promise.resolve()).then(step, step);
	const tracked = chain.catch(() => {});

	inFlight.set(recipeId, tracked);
	tracked.then(() => {
		if (inFlight.get(recipeId) === tracked) inFlight.delete(recipeId);
	});

	return chain;
}

// Rows written before favoriting was keyed by recipeId can lack one; they would
// render as blank cards, so drop them on the way in.
function usable(list: FavoriteEntry[]) {
	return list.filter((e) => Boolean(e.recipeId));
}

async function resync() {
	const res = await fetch('/api/favorites');
	if (res.ok) entries = usable(await res.json());
}

// One client-side copy of the favorites list, shared by every route: the heart on
// a recipe-card reads `has()` and writes through `toggle()`, so a click updates
// every card showing that recipe (and the favorites page) immediately, with no
// invalidateAll() round trip. Favorites are keyed by recipeId, not by the store's
// own row id, because that's what a card knows about itself.
export const favorites = {
	get entries() {
		return entries;
	},

	has(recipeId: string) {
		return entries.some((e) => e.recipeId === recipeId);
	},

	async load(fetchFn: typeof fetch = fetch) {
		if (loaded) return;
		const res = await fetchFn('/api/favorites');
		if (!res.ok) return;
		entries = usable(await res.json());
		loaded = true;
	},

	toggle(target: FavoriteTarget) {
		return this.has(target.recipeId) ? this.remove(target.recipeId) : this.add(target);
	},

	add(target: FavoriteTarget) {
		// Fill the heart now; the request catches up.
		entries = [
			...entries.filter((e) => e.recipeId !== target.recipeId),
			{ id: `pending:${target.recipeId}`, ...target },
		];

		return enqueue(target.recipeId, async () => {
			const res = await fetch('/api/favorites', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(target),
			});
			if (!res.ok) return resync();

			// Swap the placeholder for the stored row — but only if it's still there,
			// so a later click that removed it isn't undone.
			const saved: FavoriteEntry = await res.json();
			entries = entries.map((e) => (e.recipeId === saved.recipeId ? saved : e));
		});
	},

	remove(recipeId: string) {
		entries = entries.filter((e) => e.recipeId !== recipeId);

		return enqueue(recipeId, async () => {
			const res = await fetch(`/api/favorites?recipeId=${encodeURIComponent(recipeId)}`, {
				method: 'DELETE',
			});
			if (!res.ok) return resync();
		});
	},
};
