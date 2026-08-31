import type { PageServerLoad } from './$types';
import { store } from '$lib/server/db/store';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const load: PageServerLoad = async () => {
	const entries = await store.mealPlan.all();
	return { entries, days: DAYS };
};
