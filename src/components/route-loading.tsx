"use client";

import { usePathname } from "next/navigation";
import {
  AccountsLoading,
  HoldingsLoading,
  OverviewLoading,
  SettingsLoading,
} from "./loading";

// Also server-rendered: the auth lookup in the layout must not block the shell.
export function RouteLoading() {
  const path = usePathname();
  if (path === "/holdings") return <HoldingsLoading />;
  if (path === "/accounts") return <AccountsLoading />;
  if (path === "/settings") return <SettingsLoading />;
  return <OverviewLoading />;
}
