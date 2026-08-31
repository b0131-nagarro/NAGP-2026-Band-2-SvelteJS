<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function entryFor(day: string) {
		const e = data.entries.find((x) => x.day === day);
		return e ? { id: e.recipeId, title: e.title, image: e.image ?? '' } : null;
	}

	async function removeEntry(day: string) {
		const e = data.entries.find((x) => x.day === day);
		if (!e) return;
		await fetch(`/api/meal-plan?id=${e.id}`, { method: 'DELETE' });
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>Meal plan — Balpreet's Kitchen</title>
</svelte:head>

<h1>This week</h1>
<p class="hint">Add meals from any recipe's page — this grid shows what's already planned.</p>

<div class="week">
	{#each data.days as day (day)}
		<meal-plan-slot {day} recipe={entryFor(day)} onrecipeRemove={() => removeEntry(day)}></meal-plan-slot>
	{/each}
</div>

<style>
	.hint {
		color: var(--color-text-muted);
		margin-top: -0.5rem;
	}
	.week {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.75rem;
	}
</style>
