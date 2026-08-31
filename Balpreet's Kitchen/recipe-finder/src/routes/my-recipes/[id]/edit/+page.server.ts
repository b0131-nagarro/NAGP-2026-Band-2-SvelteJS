import type { PageServerLoad } from './$types';
import { store } from '$lib/server/db/store';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const recipe = await store.recipes.get(params.id);
	if (!recipe) throw error(404, 'Recipe not found');
	return { recipe };
};
