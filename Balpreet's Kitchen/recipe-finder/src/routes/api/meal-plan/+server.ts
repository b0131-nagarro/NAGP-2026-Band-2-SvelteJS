import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { store } from '$lib/server/db/store';
import { randomUUID } from 'crypto';

export const GET: RequestHandler = async () => {
	const items = await store.mealPlan.all();
	return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	// One recipe per day: replace any existing entry for that day.
	await store.mealPlan.removeByDay(body.day);

	const entry = {
		id: randomUUID(),
		day: body.day,
		recipeId: body.recipeId,
		recipeSource: body.recipeSource ?? 'mealdb',
		title: body.title,
		image: body.image ?? null,
	};
	await store.mealPlan.insert(entry);
	return json(entry, { status: 201 });
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) return json({ error: 'Missing id' }, { status: 400 });
	await store.mealPlan.remove(id);
	return json({ ok: true });
};
