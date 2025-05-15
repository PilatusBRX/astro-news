import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	
	schema: ({image}) => z.object({
		title: z.string(),
		description: z.string(),		
		author: z.string().optional(),		
		categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
		draft: z.boolean().default(false),		
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
	}),
});

export const collections = { blog };
