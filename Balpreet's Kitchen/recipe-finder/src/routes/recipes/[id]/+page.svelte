<script lang="ts">
	import { favorites } from '$lib/favorites.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let rating = $state(0);
	let selectedDay = $state('Monday');
	const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	function handleFavoriteToggle() {
		favorites.toggle({
			recipeId: data.meal.id,
			recipeSource: data.source,
			title: data.meal.title,
			image: data.meal.image ?? null,
		});
	}

	function handleRatingChange(e: CustomEvent<{ value: number }>) {
		rating = e.detail.value;
	}

	async function addToMealPlan() {
		await fetch('/api/meal-plan', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				day: selectedDay,
				recipeId: data.meal.id,
				recipeSource: data.source,
				title: data.meal.title,
				image: data.meal.image,
			}),
		});
	}
</script>

<svelte:head>
	<title>{data.meal.title} — Balpreet's Kitchen</title>
</svelte:head>

<article class="recipe">
	<recipe-card
		recipeId={data.meal.id}
		recipeTitle={data.meal.title}
		image={data.meal.image}
		favorited={favorites.has(data.meal.id)}
		onfavoriteToggle={handleFavoriteToggle}
	></recipe-card>

	<div class="rating">
		<span>Your rating:</span>
		<star-rating value={rating} onratingChange={handleRatingChange}></star-rating>
	</div>

	<div class="meal-plan-add">
		<label>
			Add to meal plan:
			<select bind:value={selectedDay}>
				{#each DAYS as d}<option value={d}>{d}</option>{/each}
			</select>
		</label>
		<button onclick={addToMealPlan}>Add</button>
	</div>

	<section>
		<h2>Ingredients</h2>
		<ul>
			{#each data.meal.ingredients as ing}
				<li>{ing}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Instructions</h2>
		<p class="instructions">{data.meal.instructions}</p>
	</section>
</article>

<style>
	.recipe {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 640px;
	}
	.recipe recipe-card {
		max-width: 320px;
	}
	.rating {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}
	.meal-plan-add {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.meal-plan-add label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}
	.meal-plan-add select {
		padding: 6px 10px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		font-family: inherit;
	}
	.meal-plan-add button {
		padding: 7px 16px;
		border-radius: var(--radius-sm);
		border: none;
		background: var(--color-accent);
		color: #fff;
		font-weight: 600;
		cursor: pointer;
	}
	ul {
		padding-left: 1.25rem;
	}
	.instructions {
		white-space: pre-line;
		line-height: 1.6;
	}
</style>
