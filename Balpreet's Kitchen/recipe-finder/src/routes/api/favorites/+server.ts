import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { store } from '$lib/server/db/store';
import { randomUUID } from 'crypto';

export const GET: RequestHandler = async () => {
	const items = await store.favorites.all();
	return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!body.recipeId || !body.title) {
		return json({ error: 'recipeId and title are required.' }, { status: 400 });
	}

	// The heart is a toggle keyed by recipeId, so favoriting the same recipe twice
	// must not stack up duplicate rows — upsert instead of insert.
	const { entry, created } = await store.favorites.upsert({
		id: randomUUID(),
		recipeId: body.recipeId,
		recipeSource: body.recipeSource ?? 'mealdb',
		title: body.title,
		image: body.image ?? null,
	});

	return json(entry, { status: created ? 201 : 200 });
};

export const DELETE: RequestHandler = async ({ url }) => {
	// recipeId is what a recipe-card knows about itself; id stays supported for
	// anything holding a store row.
	const recipeId = url.searchParams.get('recipeId');
	if (recipeId) {
		await store.favorites.removeByRecipeId(recipeId);
		return json({ ok: true });
	}

	const id = url.searchParams.get('id');
	if (id) {
		await store.favorites.remove(id);
		return json({ ok: true });
	}

	return json({ error: 'Missing recipeId or id' }, { status: 400 });
};
