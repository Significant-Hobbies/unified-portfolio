import {
  createAppHealthClient,
  type AppHealthClient,
} from "@saas-maker/app-health";

const endpoint = "https://ingest.sassmaker.com/v1/ingest";
const pageRoutes = new Set([
  "/",
  "/settings",
  "/overview",
  "/accounts",
  "/holdings",
  "/history",
  "/performance",
  "/mcp",
]);

export type AppHealthEnvironment = { APP_HEALTH_INGEST_KEY?: string };
export type AppHealthExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
};

type EndpointClient = Pick<AppHealthClient, "record" | "flush">;

let cached: { key: string; client: AppHealthClient } | undefined;

function clientFor(environment: AppHealthEnvironment): AppHealthClient | null {
  const key = environment.APP_HEALTH_INGEST_KEY;
  if (!key) return null;
  if (cached?.key !== key) {
    cached = {
      key,
      client: createAppHealthClient({
        key,
        endpoint,
        environment: "production",
        runtime: "worker",
        disableTimer: true,
        maxQueueSize: 100,
        maxBatchSize: 20,
      }),
    };
  }
  return cached.client;
}

/** Map only known route shapes. Arbitrary path segments are never reported. */
export function routeGroup(pathname: string): string | null {
  if (pageRoutes.has(pathname)) return pathname;
  if (/^\/api\/.+$/.test(pathname)) return "/api/:path";
  if (/^\/oauth\/.+$/.test(pathname)) return "/oauth/:action";
  return null;
}

export function recordEndpoint(
  client: EndpointClient | null,
  context: AppHealthExecutionContext,
  request: Request,
  status: number,
  durationMs: number,
): void {
  if (!client) return;
  const route = routeGroup(new URL(request.url).pathname);
  if (!route) return;
  client.record({
    method: request.method,
    route,
    status_code: status,
    duration_ms: durationMs,
  });
  context.waitUntil(
    client.flush().catch(() => {
      // Endpoint telemetry must never affect the portfolio response.
    }),
  );
}

export function trackEndpoint(
  environment: AppHealthEnvironment,
  context: AppHealthExecutionContext,
  request: Request,
  status: number,
  durationMs: number,
): void {
  try {
    recordEndpoint(
      clientFor(environment),
      context,
      request,
      status,
      durationMs,
    );
  } catch {
    // Misconfiguration or instrumentation errors must not affect the app.
  }
}
