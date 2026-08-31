import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { store } from '$lib/server/db/store';
import { randomUUID } from 'crypto';

export const GET: RequestHandler = async () => {
	const items = await store.recipes.all();
	return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!body.title?.trim() || !body.instructions?.trim()) {
		return json({ error: 'Title and instructions are required.' }, { status: 400 });
	}

	const recipe = {
		id: randomUUID(),
		title: body.title.trim(),
		image: body.image?.trim() || null,
		ingredients: body.ingredients ?? [],
		instructions: body.instructions.trim(),
		createdAt: Date.now(),
	};

	await store.recipes.insert(recipe);
	return json(recipe, { status: 201 });
};
