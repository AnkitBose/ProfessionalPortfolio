import { defineCollection, z } from "astro:content";

const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

const baseSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  tags: z.array(z.string().min(1)).min(1),
  summary: z.string().min(20),
  links: z.array(linkSchema).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().optional().default(false)
});

const projects = defineCollection({
  type: "content",
  schema: baseSchema
});

const labs = defineCollection({
  type: "content",
  schema: baseSchema
});

export const collections = {
  projects,
  labs
};
