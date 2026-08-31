<script lang="ts">
	import { goto } from '$app/navigation';

	function handleSearch(e: CustomEvent<{ query: string }>) {
		const q = e.detail.query;
		if (q) goto(`/recipes?q=${encodeURIComponent(q)}`);
	}
</script>

<svelte:head>
	<title>Balpreet's Kitchen</title>
</svelte:head>

<section class="hero">
	<h1>What's in the kitchen today?</h1>
	<p>Search Indian recipes, save your favorites, and plan the week ahead.</p>
	<search-bar placeholder="Try “biryani”…" onsearchSubmit={handleSearch}></search-bar>
</section>

<section class="links">
	<a class="tile" href="/recipes">Browse recipes →</a>
	<a class="tile" href="/my-recipes">Add your own recipe →</a>
	<a class="tile" href="/meal-plan">Plan the week →</a>
</section>

<style>
	.hero {
		text-align: center;
		padding: 3rem 0 2.5rem;
	}
	.hero h1 {
		font-size: 2rem;
		max-width: 20ch;
		margin: 0 auto 0.5rem;
	}
	.hero p {
		color: var(--color-text-muted);
		margin: 0 auto 1.5rem;
		max-width: 40ch;
	}
	.hero search-bar {
		display: block;
		max-width: 480px;
		margin: 0 auto;
	}
	.links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}
	.tile {
		display: block;
		padding: 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		text-decoration: none;
		color: var(--color-text);
		font-weight: 600;
		transition: transform 0.15s ease;
	}
	.tile:hover {
		transform: translateY(-2px);
	}
</style>
