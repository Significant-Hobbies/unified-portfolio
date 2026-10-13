// Run only against tests/fixtures/loading.vite.ts on loopback. No provider calls.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const origin = "http://127.0.0.1:3340";
const output = process.env.FIXTURE_OUTPUT || "artifacts/loading-fixture";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
});
const checks = [];
const errors = [];
const expectedErrors = [];
let expectingFixtureError = false;
const context = await browser.newContext();
// Keep existing app scripts in the source, but never contact external services.
await context.route("**/*", (route) => {
  const url = new URL(route.request().url());
  return url.origin === origin ? route.continue() : route.abort();
});
const page = await context.newPage();
page.on("pageerror", (e) => {
  if (
    expectingFixtureError &&
    /^Switched to client rendering because the server rendering errored:\s+synthetic fixture unavailable$/.test(
      e.message,
    )
  )
    expectedErrors.push(e.message);
  else errors.push(e.message);
});
const cookie = (name, value) => ({ name, value, url: origin });
const routes = ["/", "/holdings", "/performance", "/accounts", "/settings"];
async function capture(name, width) {
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(dimensions.scroll <= width, `${name} overflows at ${width}`);
  await page.screenshot({
    path: `${output}/${name}-${width}.png`,
    fullPage: true,
  });
  checks.push({ name, width, ...dimensions, url: page.url() });
}
async function go(path) {
  const response = await page.goto(origin + path, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
}
try {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await context.clearCookies();
    for (const token of [null, "invalid-fixture-session"]) {
      await context.clearCookies();
      if (token) await context.addCookies([cookie("portfolio_session", token)]);
      for (const path of routes) {
        await go(path);
        assert.equal(new URL(page.url()).pathname, "/settings");
        assert.equal(await page.locator(".public").count(), 1);
        assert.equal(
          await page.locator(".valuation, .account-list, .filters").count(),
          0,
        );
        assert.doesNotMatch(
          await page.locator("body").innerText(),
          /Reliance Industries|NIFTY FUT|₹15,20,900/,
        );
      }
    }
    await capture("signed-out", width);
    await context.clearCookies();
    await context.addCookies([cookie("portfolio_session", "loading-fixture")]);
    for (const path of routes) {
      await go(path);
      assert.equal(await page.locator(".app").count(), 1);
      await capture(path === "/" ? "overview" : path.slice(1), width);
    }
    await go("/holdings");
    const table = page.getByRole("region", {
      name: "Holdings table",
      exact: true,
    });
    assert.equal(await table.locator("tbody tr").count(), 5);
    const reliance = table
      .locator("tbody tr")
      .filter({ hasText: "Reliance Industries" });
    assert.match(await reliance.innerText(), /Unknown/);
    assert.match(
      await page.locator(".warning").innerText(),
      /not current market data/,
    );
    await table.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
    await capture("holdings-scrolled", width);
    const search = page.getByPlaceholder("Company, ticker or ISIN");
    await search.fill("missing-instrument");
    assert.equal(await table.locator("tbody tr").count(), 0);
    await page
      .getByRole("button", { name: "clear filters", exact: true })
      .click();
    assert.equal(await table.locator("tbody tr").count(), 5);
    await go("/");
    await page.getByRole("button", { name: "1D", exact: true }).first().click();
    assert.equal(
      await page
        .getByRole("button", { name: "1D", exact: true })
        .first()
        .getAttribute("aria-pressed"),
      "true",
    );
    await context.addCookies([cookie("portfolio_fixture", "empty")]);
    await go("/");
    assert.equal(await page.locator('[data-slot="empty-state"]').count(), 1);
    await capture("empty-overview", width);
    await go("/holdings");
    assert.equal(await page.locator("tbody tr").count(), 0);
    await capture("empty-holdings", width);
    expectingFixtureError = true;
    await context.addCookies([cookie("portfolio_fixture", "error")]);
    await go("/holdings");
    assert.equal(await page.getByRole("alert").count(), 1);
    // Vinext dev overlays intentionally cover the expected synthetic failure.
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .locator('[data-slot="error-state"] > [data-slot="empty-state"]')
        .evaluate((e) => getComputedStyle(e).flexDirection),
      "column",
    );
    await capture("error", width);
    // Clear the failure before retrying. Retry must re-fetch, not reset stale RSC.
    await context.addCookies([cookie("portfolio_fixture", "normal")]);
    await page.getByRole("button", { name: "try again", exact: true }).click();
    await page
      .getByRole("heading", { name: "Holdings", exact: true })
      .waitFor();
    assert.equal(await page.getByRole("alert").count(), 0);
    expectingFixtureError = false;
  }
  // Synthetic streaming proof, with slow auth AND data. No production timing claim.
  await page.setViewportSize({ width: 390, height: 1000 });
  await context.setExtraHTTPHeaders({
    "x-loading-auth-delay": "1500",
    "x-loading-data-delay": "1500",
  });
  for (const path of ["/", "/holdings", "/accounts", "/settings"]) {
    await page.goto(origin + path, { waitUntil: "commit" });
    await page
      .locator('[data-slot="skeleton"]')
      .first()
      .waitFor({ state: "visible" });
    assert.equal(
      await page.getByRole("navigation", { name: "Main navigation" }).count(),
      1,
    );
    assert.equal(
      await page
        .locator(".sr-only")
        .first()
        .evaluate((e) => getComputedStyle(e).position),
      "absolute",
    );
    await capture(`loading-${path === "/" ? "overview" : path.slice(1)}`, 390);
    await page
      .locator(".ledger-loading")
      .waitFor({ state: "hidden", timeout: 30000 });
  }
  // A protected page must remain protected after a delayed invalid auth lookup.
  await context.clearCookies();
  await page.goto(origin + "/holdings", { waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/settings");
  assert.equal(await page.locator(".public").count(), 1);
  assert.doesNotMatch(
    await page.locator("body").innerText(),
    /Reliance Industries|NIFTY FUT/,
  );
  await context.setExtraHTTPHeaders({});
  for (const path of [
    "/api/providers/zerodha/connect",
    "/oauth/approve",
    "/mcp",
  ]) {
    assert.equal((await context.request.get(origin + path)).status(), 403);
    assert.equal((await context.request.post(origin + path)).status(), 403);
  }
  assert.deepEqual(errors, []);
  await writeFile(
    `${output}/checks.json`,
    JSON.stringify(
      {
        checks,
        errors,
        expectedErrors,
        auth: "pass",
        retry: "pass",
        mutations: "blocked",
        qualification: "synthetic dev fixture only",
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      renders: checks.length,
      errors,
      auth: "pass",
      retry: "pass",
      mutations: "blocked",
    }),
  );
} finally {
  await browser.close();
}
