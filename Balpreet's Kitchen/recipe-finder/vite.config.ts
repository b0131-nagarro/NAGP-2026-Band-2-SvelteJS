import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      // `@balpreet-nagarro/recipe-ui-kit` is a `file:` dependency, so npm symlinks it
      // into node_modules and Vite resolves its lazy-loaded `dist/esm/*.entry.js`
      // chunks to their real path in the sibling directory — outside the default
      // allow list (this package's own folder). Without this the Stencil chunks are
      // refused and none of the custom elements ever register.
      allow: [searchForWorkspaceRoot(process.cwd()), '../recipe-ui-kit'],
    },
  },
});
