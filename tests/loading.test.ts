import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AccountsLoading,
  HoldingsLoading,
  OverviewLoading,
  SettingsLoading,
} from "../src/components/loading";
import ErrorPage from "../src/app/error";
import { Empty, money } from "../src/components/ui";
import { HistoryChart } from "../src/components/chart";
import { HoldingsTable } from "../src/components/holdings";

test("every data route renders accessible content-shaped bones on the server", () => {
  for (const screen of [
    OverviewLoading,
    HoldingsLoading,
    AccountsLoading,
    SettingsLoading,
  ]) {
    const html = renderToStaticMarkup(createElement(screen));
    assert.match(html, /data-slot="skeleton"/);
    assert.equal((html.match(/role="status"/g) || []).length, 1);
    assert.equal((html.match(/aria-busy="true"/g) || []).length, 1);
    assert.match(html, /aria-hidden="true"/);
    assert.doesNotMatch(html, /spinner/i);
  }
  const holdings = renderToStaticMarkup(createElement(HoldingsLoading));
  assert.equal((holdings.match(/<table>/g) || []).length, 2);
  assert.equal((holdings.match(/<th>/g) || []).length, 18); // 11 holdings + 7 positions
  const overview = renderToStaticMarkup(createElement(OverviewLoading));
  assert.equal((overview.match(/aspect-ratio:800 \/ 240/g) || []).length, 2);
});

test("empty portfolio, filtered holdings and history use shared empty states", () => {
  const portfolio = renderToStaticMarkup(createElement(Empty));
  assert.match(portfolio, /data-slot="empty-state"/);
  assert.match(portfolio, /href="\/accounts"/);
  const holdings = renderToStaticMarkup(
    createElement(HoldingsTable, { holdings: [] }),
  );
  assert.match(holdings, /no holdings match these filters/);
  assert.match(holdings, /clear filters/);
  const chart = renderToStaticMarkup(
    createElement(HistoryChart, { rows: [], currency: "INR" }),
  );
  assert.match(chart, /data-slot="empty-state"/);
  assert.doesNotMatch(chart, /<svg/);
  assert.equal(money(null), "Unknown");
});

test("route failure announces a safe message and retries the server request", () => {
  let attempts = 0;
  const retry = () => {
    attempts++;
  };
  const fallback = ErrorPage({ retry });
  const html = renderToStaticMarkup(fallback);
  assert.match(html, /data-slot="error-state"/);
  assert.match(html, /role="alert"/);
  assert.match(html, /stored observations have not been replaced/);
  assert.match(html, /try again/);
  fallback.props.primaryAction.props.onClick();
  assert.equal(attempts, 1);
  ErrorPage({ unstable_retry: retry }).props.primaryAction.props.onClick();
  assert.equal(attempts, 2);

  // Vinext route boundaries currently supply only reset, which cannot re-fetch.
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { location: { reload: retry } },
  });
  try {
    ErrorPage({}).props.primaryAction.props.onClick();
    assert.equal(attempts, 3);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
