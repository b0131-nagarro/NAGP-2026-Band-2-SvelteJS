# recipe-ui-kit

Reusable StencilJS component library for Balpreet's Kitchen Recipe Finder & Meal Planner.

## Components

- `<recipe-card recipe-id title image favorited>` — emits `favoriteToggle` `{id}`
- `<star-rating value max readonly>` — emits `ratingChange` `{value}`
- `<search-bar value placeholder>` — emits `searchSubmit` `{query}`
- `<filter-panel categories selected>` — emits `filterChange` `{selected}`
- `<meal-plan-slot day recipe>` — emits `recipeRemove` `{day}`
- `<recipe-form initial-value>` — emits `formSubmit` (RecipeInput), `formCancel`

Props holding non-string values (booleans, arrays, objects) are set as DOM
properties, not string attributes. That's the default when used from a real
framework binding (Svelte, React, etc.) — no special handling needed on your
side, it just works as long as the element is already defined when the prop is
set (see the "SSR note" in recipe-finder's README).

## Theming

Components read these CSS custom properties, with sensible fallbacks if unset:
`--color-accent`, `--color-accent-dark`, `--color-gold`, `--color-danger`,
`--color-border`, `--color-text`, `--color-text-muted`, `--color-surface`,
`--font-display`, `--font-body`, `--radius-sm`, `--radius-md`. Define them at
`:root` in the consuming app — custom properties cross the shadow DOM boundary
even though normal styles don't.
