// Imported only by loading.vite.ts's test-only aliases; never by the app build.
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { loadingData } from "./loading-data";

export const cookieName = "portfolio_session";
export const fixtureToken = "loading-fixture";

async function delay(header: string) {
  const milliseconds = Number((await headers()).get(header) || 0);
  if (Number.isFinite(milliseconds) && milliseconds > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(milliseconds, 10_000)),
    );
  }
}

export async function sessionIdentity() {
  await delay("x-loading-auth-delay");
  const token = (await cookies()).get(cookieName)?.value;
  return token === fixtureToken
    ? { token, userId: "loading-fixture-user" }
    : null;
}
export async function ownerSession() {
  return (await sessionIdentity())?.token || null;
}
export const googleReady = () => false;
export const origin = () => "http://127.0.0.1:3340";
export const hash = () => "synthetic-consent-owner";

async function state() {
  await delay("x-loading-data-delay");
  const mode = (await cookies()).get("portfolio_fixture")?.value;
  if (mode === "error") throw new Error("synthetic fixture unavailable");
  return mode;
}
export async function indmoneyScope() {
  await state();
  return "ALL" as const;
}
export async function view() {
  if (!(await sessionIdentity())) redirect("/settings");
  const mode = await state();
  return loadingData(mode === "empty");
}
