import type { PageServerLoad } from './$types';
import { store } from '$lib/server/db/store';

export const load: PageServerLoad = async () => {
	const items = await store.recipes.all();
	return { recipes: items };
};
