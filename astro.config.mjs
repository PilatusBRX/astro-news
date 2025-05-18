// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	base: "/",
	trailingSlash: 'always',	
	prefetch: {
	  prefetchAll: true
	},	
	site: 'https://dialogando.netlify.app',
	integrations: [icon(), mdx(), sitemap()],
});
