import assert from "node:assert/strict";
import { test } from "node:test";
import {
  recordEndpoint,
  routeGroup,
  trackEndpoint,
} from "../src/server/app-health";

test("route groups never include arbitrary identifiers or unknown routes", () => {
  assert.equal(routeGroup("/settings"), "/settings");
  assert.equal(routeGroup("/api/accounts/secret-user-token"), "/api/:path");
  assert.equal(routeGroup("/oauth/callback/private-code"), "/oauth/:action");
  assert.equal(routeGroup("/unknown/private-account"), null);
});

test("endpoint events contain only bounded request summary fields", async () => {
  const events: unknown[] = [];
  const pending: Promise<unknown>[] = [];
  const client = {
    record(event: unknown) {
      events.push(event);
    },
    flush() {
      return Promise.resolve();
    },
  };
  const request = new Request(
    "https://money.significanthobbies.com/api/accounts/account-secret?token=query-secret",
    {
      method: "POST",
      headers: { cookie: "session-secret" },
      body: "financial-body",
    },
  );

  recordEndpoint(
    client,
    { waitUntil: (promise) => pending.push(promise) },
    request,
    401,
    12.4,
  );

  assert.deepEqual(events, [
    {
      method: "POST",
      route: "/api/:path",
      status_code: 401,
      duration_ms: 12.4,
    },
  ]);
  await Promise.all(pending);
});

test("missing key and unmapped route produce no event or flush", () => {
  let records = 0;
  let flushes = 0;
  const client = {
    record() {
      records += 1;
    },
    flush() {
      flushes += 1;
      return Promise.resolve();
    },
  };
  let waitUntilCalls = 0;
  const context = {
    waitUntil() {
      waitUntilCalls += 1;
    },
  };
  const unknown = new Request(
    "https://money.significanthobbies.com/user/private-id",
  );

  trackEndpoint(
    {},
    context,
    new Request("https://money.significanthobbies.com/settings"),
    200,
    3,
  );
  recordEndpoint(client, context, unknown, 200, 3);

  assert.equal(records, 0);
  assert.equal(flushes, 0);
  assert.equal(waitUntilCalls, 0);
});

test("ingest failures are swallowed by the scheduled flush", async () => {
  let scheduled: Promise<unknown> | undefined;
  const client = {
    record() {},
    flush() {
      return Promise.reject(new Error("collector unavailable"));
    },
  };

  recordEndpoint(
    client,
    { waitUntil: (promise) => (scheduled = promise) },
    new Request("https://money.significanthobbies.com/settings"),
    200,
    2,
  );

  assert.ok(scheduled);
  await assert.doesNotReject(scheduled);
});
