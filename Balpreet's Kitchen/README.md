# Balpreet's Kitchen — Recipe Finder & Meal Planner

Two projects:

- `recipe-ui-kit/` — the StencilJS component library, published to npm
- `recipe-finder/` — the SvelteKit app, which consumes it from npm

## Links

- **npm package:** https://www.npmjs.com/package/@balpreet-nagarro/recipe-ui-kit
- **GitHub repository:** https://github.com/b0131-nagarro/NAGP-2026-Band-2-SvelteJS/tree/main

## Setup

```bash
cd recipe-finder
npm install
```

To build the component library locally:

```bash
cd recipe-ui-kit
npm install
npm run build
```

## Starting the development server

```bash
cd recipe-finder
npm run dev
```

Opens on http://localhost:5173.

## Assumptions

- **Used MealDB API for Recipes** Recipes available from a public repo to query and use.
- **Persistence is one local JSON file** (`recipe-finder/data/db.json`) behind the app's own `/api/*` routes — no database. It will not survive a serverless deploy (Vercel, Netlify); use a host with a persistent disk.
- **The built-in catalog is Indian cuisine** — `/recipes` browses TheMealDB's `India` area, and the filter chips are the categories that actually contain Indian meals. Search is deliberately unscoped and queries all of TheMealDB.
- **Favorites are keyed by `recipeId`**, and the POST route upserts, so the heart behaves the same on every card and cannot create duplicates.
- **One recipe per day** in the meal plan — adding to a day replaces what was there.
- **TheMealDB is read-only.** User-created recipes, favorites, and the meal plan are local CRUD.
