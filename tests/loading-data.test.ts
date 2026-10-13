import { test } from "node:test";
import assert from "node:assert/strict";
import { loadingData } from "./fixtures/loading-data";

test("loading fixture history retains current sources, unknown basis and stale coverage", () => {
  const { current, snapshots, connections, history } = loadingData();
  assert.deepEqual(
    connections.map((c) => c.id),
    ["zerodha", "indmoney"],
  );
  assert.equal(snapshots[0].holdings[0].averagePrice, null);
  assert.equal(snapshots[0].holdings[0].investedValue, null);
  assert.equal(
    current.providers.find((p) => p.provider === "zerodha")?.status,
    "stale",
  );
  assert.equal(
    current.totals.find((t) => t.currency === "INR")?.investedValue,
    null,
  );
  assert.equal(history.length, 31);
  for (const observation of history) {
    assert.deepEqual(observation.providers, current.providers);
    assert.deepEqual(observation.holdings, current.holdings);
    assert.equal(
      observation.totals.find((t) => t.currency === "INR")?.investedValue,
      null,
    );
  }
  assert.deepEqual(history.at(-1)?.totals, current.totals);
});

test("empty loading fixture has no invented history or holdings", () => {
  const d = loadingData(true);
  assert.deepEqual(d.snapshots, []);
  assert.deepEqual(d.current.holdings, []);
  assert.deepEqual(d.history, []);
  assert.equal(d.connections.length, 2);
});
