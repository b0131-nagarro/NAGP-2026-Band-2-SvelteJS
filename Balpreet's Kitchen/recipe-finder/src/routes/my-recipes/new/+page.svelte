<script lang="ts">
	import { goto } from '$app/navigation';

	interface RecipeInput {
		title: string;
		image: string;
		ingredients: string[];
		instructions: string;
	}

	async function handleSubmit(e: CustomEvent<RecipeInput>) {
		const res = await fetch('/api/recipes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(e.detail),
		});
		if (res.ok) goto('/my-recipes');
	}
</script>

<svelte:head>
	<title>New recipe — Balpreet's Kitchen</title>
</svelte:head>

<h1>New recipe</h1>
<recipe-form onformSubmit={handleSubmit} onformCancel={() => goto('/my-recipes')}></recipe-form>
