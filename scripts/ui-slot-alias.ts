import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

// Vinext beta.9's barrel optimizer and plugin-rsc 0.5.34 recurse while
// resolving @radix-ui/react-slot in RSC builds. Resolve the installed Radix
// ESM entry before those hooks, preserving the library and dependency versions.
// Resolve from the UI package so pnpm's strict transitive layout works in CI.
const appRequire = createRequire(import.meta.url);
const uiRequire = createRequire(
  appRequire.resolve("@saas-maker/ui/components/button"),
);
const radixRequire = createRequire(uiRequire.resolve("radix-ui"));
export const uiSlotAlias = {
  find: "@radix-ui/react-slot",
  replacement: resolve(
    dirname(radixRequire.resolve("@radix-ui/react-slot")),
    "index.mjs",
  ),
};
