import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./primitives";
import type { Position } from "../core/model";
import { money, names, age } from "./ui";
export function PositionsTable({ positions }: { positions: Position[] }) {
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label="Open positions"
      tabIndex={0}
    >
      <Table>
        <TableHeader>
          <TableRow>
            {[
              "Instrument",
              "Broker / observed",
              "Net quantity",
              "Average price",
              "Last price",
              "Reported unrealized P&L",
              "Reported realized P&L",
            ].map((h) => (
              <TableHead scope="col" key={h}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((p, i) => (
            <TableRow key={p.accountId + p.instrumentId + i}>
              <TableCell>
                <strong>{p.ticker}</strong>
                <small>{p.exchange}</small>
              </TableCell>
              <TableCell>
                {names[p.source]}
                <small>{age(p.asOf)}</small>
              </TableCell>
              <TableCell className="numeric">{p.quantity}</TableCell>
              <TableCell className="numeric">
                {money(p.averagePrice, p.currency)}
              </TableCell>
              <TableCell className="numeric">
                {money(p.marketPrice, p.currency)}
              </TableCell>
              <TableCell className="numeric">
                {money(p.unrealizedPnL, p.currency)}
              </TableCell>
              <TableCell className="numeric">
                {money(p.realizedPnL, p.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
