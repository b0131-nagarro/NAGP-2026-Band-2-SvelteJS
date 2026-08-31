<script lang="ts">
	import '$lib/styles/tokens.css';

	let { children } = $props();
</script>

<div class="shell">
	<header class="site-header">
		<a class="wordmark" href="/">Balpreet's Kitchen</a>
		<nav>
			<a href="/recipes">Browse</a>
			<a href="/favorites">Favorites</a>
			<a href="/meal-plan">Meal plan</a>
			<a href="/my-recipes">My recipes</a>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	.shell {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-surface);
	}
	.wordmark {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		text-decoration: none;
		color: var(--color-accent-dark);
	}
	nav {
		display: flex;
		gap: 1.25rem;
	}
	nav a {
		text-decoration: none;
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}
	nav a:hover {
		color: var(--color-text);
	}
	main {
		flex: 1;
		max-width: 1080px;
		width: 100%;
		margin: 0 auto;
		padding: 1.5rem;
	}
	@media (max-width: 640px) {
		.site-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
		nav {
			gap: 1rem;
			flex-wrap: wrap;
		}
	}
</style>
