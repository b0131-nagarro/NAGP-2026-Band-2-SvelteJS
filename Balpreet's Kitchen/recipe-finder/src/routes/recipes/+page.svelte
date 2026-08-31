<script lang="ts">
	import { goto } from '$app/navigation';
	import { favorites } from '$lib/favorites.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function handleSearch(e: CustomEvent<{ query: string }>) {
		const q = e.detail.query;
		goto(q ? `/recipes?q=${encodeURIComponent(q)}` : '/recipes');
	}

	// filter-panel is multi-select: it emits the whole next selection, so use the
	// array rather than only its first entry. Taking `selected[0]` meant clicking
	// a second chip navigated straight back to the category that was already
	// active, so switching filters appeared to do nothing.
	function handleFilterChange(e: CustomEvent<{ selected: string[] }>) {
		const cats = e.detail.selected;
		goto(cats.length ? `/recipes?category=${cats.map(encodeURIComponent).join(',')}` : '/recipes');
	}
</script>

<svelte:head>
	<title>Browse recipes — Balpreet's Kitchen</title>
</svelte:head>

<div class="toolbar">
	<search-bar value={data.q} placeholder="Search recipes…" onsearchSubmit={handleSearch}></search-bar>
	<filter-panel
		categories={data.categories}
		selected={data.selected}
		onfilterChange={handleFilterChange}
	></filter-panel>
</div>

{#if data.meals.length === 0}
	<p class="empty">No recipes found. Try a different search or category.</p>
{:else}
	<div class="grid">
		{#each data.meals as meal (meal.id)}
			<recipe-card
				recipeId={meal.id}
				recipeTitle={meal.title}
				image={meal.image}
				favorited={favorites.has(meal.id)}
				onfavoriteToggle={() =>
					favorites.toggle({
						recipeId: meal.id,
						recipeSource: 'mealdb',
						title: meal.title,
						image: meal.image,
					})}
			></recipe-card>
		{/each}
	</div>
{/if}

<style>
	.toolbar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
	}
	.empty {
		color: var(--color-text-muted);
	}
</style>
