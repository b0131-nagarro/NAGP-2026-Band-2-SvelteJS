export interface LocalRecipe {
	id: string;
	title: string;
	image: string | null;
	ingredients: string[];
	instructions: string;
	createdAt: number;
}

export interface FavoriteEntry {
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
