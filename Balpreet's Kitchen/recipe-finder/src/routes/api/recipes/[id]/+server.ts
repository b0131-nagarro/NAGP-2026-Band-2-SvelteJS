import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { store } from '$lib/server/db/store';

export const GET: RequestHandler = async ({ params }) => {
	const recipe = await store.recipes.get(params.id);
	if (!recipe) return json({ error: 'Not found' }, { status: 404 });
	return json(recipe);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();

	if (!body.title?.trim() || !body.instructions?.trim()) {
		return json({ error: 'Title and instructions are required.' }, { status: 400 });
	}

	const updated = await store.recipes.update(params.id, {
		title: body.title.trim(),
		image: body.image?.trim() || null,
		ingredients: body.ingredients ?? [],
		instructions: body.instructions.trim(),
	});

	if (!updated) return json({ error: 'Not found' }, { status: 404 });
	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ params }) => {
	await store.recipes.remove(params.id);
	return json({ ok: true });
};
