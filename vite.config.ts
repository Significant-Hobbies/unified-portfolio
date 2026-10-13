import { uiSlotAlias } from "./scripts/ui-slot-alias";
import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  resolve: { alias: [uiSlotAlias] },
  // Tailwind directives require PostCSS rather than CSS-only transforms.
  css: { transformer: "postcss" },
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
