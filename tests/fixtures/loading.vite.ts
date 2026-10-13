import { uiSlotAlias } from "../../scripts/ui-slot-alias";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";

const fixtureDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(fixtureDir, "../..");
const fixtureModule = resolve(fixtureDir, "loading-server.ts");

const fixture: Plugin = {
  name: "loading-fixture-only",
  enforce: "pre",
  resolveId(source, importer) {
    if (!importer || !source.startsWith(".")) return;
    const from = importer.split("?")[0];
    const target = resolve(dirname(from), source).replace(/\.tsx?$/, "");
    const screen =
      from === resolve(root, "src/app/layout.tsx") ||
      from === resolve(root, "src/app/settings/page.tsx");
    if (
      target === resolve(root, "src/server/view") ||
      (screen &&
        ["auth", "google", "preferences", "crypto"].some(
          (name) => target === resolve(root, `src/server/${name}`),
        ))
    ) {
      return fixtureModule;
    }
  },
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      // This measurement server cannot authenticate providers or mutate data.
      if (
        (request.method !== "GET" && request.method !== "HEAD") ||
        /^\/(api|oauth|mcp)(\/|$)/.test(request.url || "")
      ) {
        response.statusCode = 403;
        response.end("fixture is read-only");
        return;
      }
      next();
    });
  },
};

export default defineConfig({
  root,
  resolve: { alias: [uiSlotAlias] },
  css: { transformer: "postcss" },
  envDir: fixtureDir,
  plugins: [fixture, vinext()],
  server: { host: "127.0.0.1", port: 3340, strictPort: true },
});
