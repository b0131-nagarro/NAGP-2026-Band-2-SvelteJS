const BASE = 'https://www.themealdb.com/api/json/v1/1';

export interface MealSummary {
	id: string;
	title: string;
	image: string;
	category: string;
}

export interface MealDetail extends MealSummary {
	instructions: string;
	ingredients: string[];
}

export async function searchMeals(query: string, fetchFn: typeof fetch = fetch): Promise<MealSummary[]> {
	const res = await fetchFn(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
	const data = await res.json();
	return (data.meals ?? []).map(mapSummary);
}

export async function browseMealsByArea(area: string, fetchFn: typeof fetch = fetch): Promise<MealSummary[]> {
	const res = await fetchFn(`${BASE}/filter.php?a=${encodeURIComponent(area)}`);
	const data = await res.json();
	// filter.php returns only id/title/thumb — no category, hence the empty string.
	return (data.meals ?? []).map((m: any) => ({
		id: m.idMeal,
		title: m.strMeal,
		image: m.strMealThumb,
		category: '',
	}));
}

// TheMealDB can't filter on an area and a category in the same call, so category
// filtering within a cuisine is done by intersecting ids: fetch the category's
// full id list and keep the cuisine's meals that appear in it.
export async function mealIdsByCategory(
	category: string,
	fetchFn: typeof fetch = fetch,
): Promise<Set<string>> {
	const res = await fetchFn(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
	const data = await res.json();
	return new Set<string>((data.meals ?? []).map((m: any) => m.idMeal as string));
}

export async function getMealById(id: string, fetchFn: typeof fetch = fetch): Promise<MealDetail | null> {
	const res = await fetchFn(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
	const data = await res.json();
	const meal = data.meals?.[0];
	if (!meal) return null;

	const ingredients: string[] = [];
	for (let i = 1; i <= 20; i++) {
		const ing = meal[`strIngredient${i}`];
		const measure = meal[`strMeasure${i}`];
		if (ing && ing.trim()) ingredients.push(`${measure?.trim() ?? ''} ${ing.trim()}`.trim());
	}

	return {
		id: meal.idMeal,
		title: meal.strMeal,
		image: meal.strMealThumb,
		category: meal.strCategory,
		instructions: meal.strInstructions,
		ingredients,
	};
}

function mapSummary(m: any): MealSummary {
	return { id: m.idMeal, title: m.strMeal, image: m.strMealThumb, category: m.strCategory };
}
