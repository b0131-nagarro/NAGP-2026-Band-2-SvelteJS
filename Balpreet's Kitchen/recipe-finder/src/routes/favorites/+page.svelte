<script lang="ts">
	import { favorites } from '$lib/favorites.svelte';
</script>

<svelte:head>
	<title>Favorites — Balpreet's Kitchen</title>
</svelte:head>

<h1>Favorites</h1>

{#if favorites.entries.length === 0}
	<p class="empty">No favorites yet — recipes you heart will show up here.</p>
{:else}
	<div class="grid">
		{#each favorites.entries as fav (fav.recipeId)}
			<recipe-card
				recipeId={fav.recipeId}
				recipeTitle={fav.title}
				image={fav.image ?? ''}
				favorited={true}
				onfavoriteToggle={() => favorites.remove(fav.recipeId)}
			></recipe-card>
		{/each}
	</div>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
	}
	.empty {
		color: var(--color-text-muted);
	}
</style>
