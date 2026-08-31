<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	interface RecipeInput {
		title: string;
		image: string;
		ingredients: string[];
		instructions: string;
	}

	async function handleSubmit(e: CustomEvent<RecipeInput>) {
		const res = await fetch(`/api/recipes/${data.recipe.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(e.detail),
		});
		if (res.ok) goto('/my-recipes');
	}
</script>

<svelte:head>
	<title>Edit {data.recipe.title} — Balpreet's Kitchen</title>
</svelte:head>

<h1>Edit recipe</h1>
<recipe-form
	initialValue={data.recipe}
	onformSubmit={handleSubmit}
	onformCancel={() => goto('/my-recipes')}
></recipe-form>
