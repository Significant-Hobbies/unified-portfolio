import { demo } from "./portfolio";
import { portfolio } from "../../src/core/portfolio";

// Synthetic observations only. History must describe the same sources and
// cost-basis coverage as the current loading fixture, never the broader demo.
export function loadingData(empty = false) {
  const d = demo();
  const connections = d.connections.filter((c) => c.id !== "angelone");
  connections[0] = {
    ...connections[0],
    status: "NEEDS_LOGIN",
    errorCode: "SESSION_EXPIRED",
  };
  const snapshots = empty
    ? []
    : d.snapshots.filter((s) => s.provider !== "angelone");
  if (snapshots[0]) {
    snapshots[0].holdings[0].averagePrice = null;
    snapshots[0].holdings[0].investedValue = null;
  }
  const current = portfolio(snapshots, connections);
  const history = empty
    ? []
    : d.history.map(({ day }, i) => ({
        ...current,
        day,
        totals: current.totals.map((t) => ({
          ...t,
          marketValue: String(Number(t.marketValue) * (0.94 + i * 0.002)),
          totalValue:
            t.totalValue === null
              ? null
              : String(Number(t.totalValue) * (0.94 + i * 0.002)),
        })),
      }));
  return { snapshots, connections, current, history, setup: false };
}
