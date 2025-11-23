import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter from '@sveltejs/adapter-auto';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
		adapter: adapter()
	},
	onwarn: (warning, handler) => {
		// Ignore "css_unused_selector" warnings
		if (warning.code === 'css_unused_selector') {
			return;
		}
		// Let other warnings be handled by the default handler
		handler(warning);
	}
}