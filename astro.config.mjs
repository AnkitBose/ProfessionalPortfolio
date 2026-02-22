import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://AnkitBose.github.io",
  base: "/Portfolio/",
  output: "static",
  integrations: [tailwind(), sitemap(), react()]
});
