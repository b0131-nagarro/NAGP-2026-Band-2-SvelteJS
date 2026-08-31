import { browser } from '$app/environment';
import { favorites } from '$lib/favorites.svelte';
import type { LayoutLoad } from './$types';

// The Stencil component library is used throughout this app (per the assignment's
// integration requirement), and its default lazy-loading output only reliably
// defines custom elements in the browser. Rather than fight SSR/hydration
// mismatches on a route-by-route basis, SSR is off app-wide: this becomes a
// client-rendered (SPA-style) app. See recipe-finder/README.md "Assumptions".
export const ssr = false;

// Registering the custom elements has to happen here, before any route renders,
// not in a component's onMount. Svelte assigns a value to an element *property*
// only when the tag is already upgraded; for an unregistered tag it falls back
// to setAttribute, and both kinds of prop this app passes are lost that way:
//
//   - arrays and objects (`categories`, `selected`, `initialValue`, `recipe`) —
//     Stencil doesn't observe an attribute for non-primitive props at all
//   - camelCase names (`recipeId`, `recipeTitle`) — the attribute lands as
//     `recipeid`, while Stencil listens for `recipe-id`
//
// Defining first is what makes the category chips render and the heart fill in.
export const load: LayoutLoad = async ({ fetch }) => {
	if (!browser) return;

	const { defineCustomElements } = await import('@balpreet-nagarro/recipe-ui-kit/loader');
	await defineCustomElements();

	await favorites.load(fetch);
};
