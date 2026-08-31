import type { PageLoad } from './$types';
import { searchMeals, browseMealsByArea, mealIdsByCategory } from '$lib/mealdb';

// The built-in catalog is Indian cuisine. TheMealDB's area value for it is
// "India" — /list.php?a=list spells it "Indian", but no meal actually carries
// that area, so filtering on "Indian" comes back empty.
const CUISINE = 'India';

// Only categories that genuinely have Indian meals, so no chip can return an
// empty grid. Between them they cover the whole cuisine.
const CATEGORIES = ['Chicken', 'Vegetarian', 'Lamb', 'Breakfast', 'Seafood', 'Beef', 'Dessert'];

export const load: PageLoad = async ({ url, fetch }) => {
	const q = url.searchParams.get('q') ?? '';

	// Chips are multi-select, so the category param is a comma-separated list.
	// A search takes over the grid, and clears the chips with it.
	const selected = q
		? []
		: (url.searchParams.get('category') ?? '')
				.split(',')
				.filter((c) => CATEGORIES.includes(c));

	if (q) {
		return { meals: await searchMeals(q, fetch), categories: CATEGORIES, q, selected };
	}

	let meals = await browseMealsByArea(CUISINE, fetch);

	if (selected.length > 0) {
		const idSets = await Promise.all(selected.map((c) => mealIdsByCategory(c, fetch)));
		meals = meals.filter((m) => idSets.some((ids) => ids.has(m.id)));
	}

	return { meals, categories: CATEGORIES, q, selected };
};
