// Local, dependency-free persistence: one JSON file on disk, read/written by
// SvelteKit's server routes. No external service, no account, no .env values.
//
// Trade-off (see recipe-finder/README.md "Assumptions"): this file lives on
// the server process's local filesystem, so it does NOT survive a deploy to
// a serverless host (Vercel, Netlify) where the filesystem resets between
// invocations. It works fine for local dev, for grading demos, and for
// deployment to any host with a persistent disk (Railway, Render, Fly.io,
// a plain VPS).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export interface Recipe {
	id: string;
	title: string;
	image: string | null;
	ingredients: string[];
	instructions: string;
	createdAt: number;
}

export interface Favorite {
	id: string;
	recipeId: string;
	recipeSource: 'mealdb' | 'local';
	title: string;
	image: string | null;
}

export interface MealPlanEntry {
	id: string;
	day: string;
	recipeId: string;
	recipeSource: 'mealdb' | 'local';
	title: string;
	image: string | null;
}

interface DbShape {
	recipes: Recipe[];
	favorites: Favorite[];
	mealPlanEntries: MealPlanEntry[];
}

const EMPTY: DbShape = { recipes: [], favorites: [], mealPlanEntries: [] };

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

async function ensureFile() {
	if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
	if (!existsSync(DATA_FILE)) await writeFile(DATA_FILE, JSON.stringify(EMPTY, null, 2));
}

async function readDb(): Promise<DbShape> {
	await ensureFile();
	return JSON.parse(await readFile(DATA_FILE, 'utf-8')) as DbShape;
}

async function writeDb(data: DbShape) {
	await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Reads and writes both touch one file, so queue every operation onto a
// single chain — otherwise two requests racing (e.g. a fast double-click)
// could both read the old file, then each write back an update that clobbers
// the other's.
let queue: Promise<unknown> = Promise.resolve();
function serialize<T>(fn: () => Promise<T>): Promise<T> {
	const result = queue.then(fn, fn);
	queue = result.catch(() => {});
	return result;
}

export const store = {
	recipes: {
		all: () => serialize(async () => (await readDb()).recipes),
		get: (id: string) => serialize(async () => (await readDb()).recipes.find((r) => r.id === id) ?? null),
		insert: (recipe: Recipe) =>
			serialize(async () => {
				const db = await readDb();
				db.recipes.push(recipe);
				await writeDb(db);
				return recipe;
			}),
		update: (id: string, patch: Partial<Recipe>) =>
			serialize(async () => {
				const db = await readDb();
				const idx = db.recipes.findIndex((r) => r.id === id);
				if (idx === -1) return null;
				db.recipes[idx] = { ...db.recipes[idx], ...patch };
				await writeDb(db);
				return db.recipes[idx];
			}),
		remove: (id: string) =>
			serialize(async () => {
				const db = await readDb();
				db.recipes = db.recipes.filter((r) => r.id !== id);
				await writeDb(db);
			}),
	},
	favorites: {
		all: () => serialize(async () => (await readDb()).favorites),
		// Check-then-insert has to happen inside one serialized step, or a double
		// click can get two reads of the old file through before either writes.
		upsert: (entry: Favorite) =>
			serialize(async () => {
				const db = await readDb();
				const existing = db.favorites.find((f) => f.recipeId === entry.recipeId);
				if (existing) return { entry: existing, created: false };
				db.favorites.push(entry);
				await writeDb(db);
				return { entry, created: true };
			}),
		remove: (id: string) =>
			serialize(async () => {
				const db = await readDb();
				db.favorites = db.favorites.filter((f) => f.id !== id);
				await writeDb(db);
			}),
		removeByRecipeId: (recipeId: string) =>
			serialize(async () => {
				const db = await readDb();
				db.favorites = db.favorites.filter((f) => f.recipeId !== recipeId);
				await writeDb(db);
			}),
	},
	mealPlan: {
		all: () => serialize(async () => (await readDb()).mealPlanEntries),
		insert: (entry: MealPlanEntry) =>
			serialize(async () => {
				const db = await readDb();
				db.mealPlanEntries.push(entry);
				await writeDb(db);
				return entry;
			}),
		removeByDay: (day: string) =>
			serialize(async () => {
				const db = await readDb();
				db.mealPlanEntries = db.mealPlanEntries.filter((e) => e.day !== day);
				await writeDb(db);
			}),
		remove: (id: string) =>
			serialize(async () => {
				const db = await readDb();
				db.mealPlanEntries = db.mealPlanEntries.filter((e) => e.id !== id);
				await writeDb(db);
			}),
	},
};
