import type { PageLoad } from './$types';
import { getMealById } from '$lib/mealdb';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch }) => {
	const meal = await getMealById(params.id, fetch);
	if (meal) return { meal, source: 'mealdb' as const };

	// Not a TheMealDB id — check whether it's one of the user's own recipes.
	const res = await fetch(`/api/recipes/${params.id}`);
	if (res.ok) {
		const local = await res.json();
		return {
			meal: {
				id: local.id,
				title: local.title,
				image: local.image,
				instructions: local.instructions,
				ingredients: local.ingredients as string[],
			},
			source: 'local' as const,
		};
	}

	throw error(404, 'Recipe not found');
};
