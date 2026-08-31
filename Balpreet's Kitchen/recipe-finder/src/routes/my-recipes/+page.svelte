<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { favorites } from '$lib/favorites.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	async function remove(id: string) {
		if (!confirm('Delete this recipe?')) return;
		await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
		await favorites.remove(id);
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>My recipes — Balpreet's Kitchen</title>
</svelte:head>

<div class="header-row">
	<h1>My recipes</h1>
	<a class="new-btn" href="/my-recipes/new">+ New recipe</a>
</div>

{#if data.recipes.length === 0}
	<p class="empty">You haven't added any recipes yet.</p>
{:else}
	<div class="list">
		{#each data.recipes as r (r.id)}
			<div class="row">
				<recipe-card
					recipeId={r.id}
					recipeTitle={r.title}
					image={r.image ?? ''}
					favorited={favorites.has(r.id)}
					onfavoriteToggle={() =>
						favorites.toggle({
							recipeId: r.id,
							recipeSource: 'local',
							title: r.title,
							image: r.image,
						})}
				></recipe-card>
				<div class="row-actions">
					<a href={`/my-recipes/${r.id}/edit`}>Edit</a>
					<button onclick={() => remove(r.id)}>Delete</button>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	.new-btn {
		text-decoration: none;
		background: var(--color-accent);
		color: #fff;
		padding: 8px 16px;
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: 0.9rem;
	}
	.list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
	}
	.row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.row-actions {
		display: flex;
		gap: 0.75rem;
		font-size: 0.85rem;
	}
	.row-actions button {
		background: none;
		border: none;
		color: var(--color-danger);
		cursor: pointer;
		padding: 0;
		font: inherit;
	}
	.empty {
		color: var(--color-text-muted);
	}
</style>
