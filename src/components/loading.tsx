import { Skeleton } from "@saas-maker/ui/components/skeleton";
import type { ReactNode } from "react";

function Line({ className = "" }: { className?: string }) {
  return <Skeleton className={`ledger-skeleton skeleton-line ${className}`} />;
}

function Heading({ health = true }: { health?: boolean }) {
  return (
    <header className="page-heading">
      <div className="skeleton-heading">
        <Line className="skeleton-title" />
        <Line className="skeleton-description" />
      </div>
      {health && <Line className="skeleton-health" />}
    </header>
  );
}

function LoadingPage({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="ledger-loading" role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

function Chart() {
  return (
    <section className="chart-section">
      <div className="section-heading">
        <div>
          <Line className="skeleton-section-title" />
          <Line className="skeleton-caption" />
        </div>
        <div className="periods">
          {Array.from({ length: 6 }, (_, i) => (
            <Line className="skeleton-period" key={i} />
          ))}
        </div>
      </div>
      <Skeleton className="ledger-skeleton skeleton-chart" />
      <div className="chart-range chart-dates">
        <Line className="skeleton-caption" />
        <Line className="skeleton-caption" />
      </div>
      <Line className="skeleton-description" />
      <Line className="skeleton-control skeleton-disclosure" />
      <Line className="skeleton-footnote" />
    </section>
  );
}

export function OverviewLoading() {
  return (
    <LoadingPage label="loading your portfolio…">
      <Heading />
      <section className="valuation">
        <Line className="skeleton-caption valuation-label" />
        <div className="currency-values">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i}>
              <Line className="skeleton-caption" />
              <Line className="skeleton-caption" />
              <Line className="skeleton-number" />
              {Array.from({ length: 3 }, (_, j) => (
                <div className="value-detail" key={j}>
                  <Line className="skeleton-caption" />
                  <Line className="skeleton-caption" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <Line className="skeleton-footnote" />
      </section>
      <Chart />
      <Chart />
      <Line className="skeleton-footnote" />
      <div className="two-column">
        {Array.from({ length: 2 }, (_, i) => (
          <section className="panel" key={i}>
            <div className="section-heading">
              <Line className="skeleton-section-title" />
            </div>
            {Array.from({ length: 3 }, (_, j) => (
              <div className="source-row" key={j}>
                <Line className="skeleton-caption" />
                <Line className="skeleton-description" />
              </div>
            ))}
          </section>
        ))}
      </div>
    </LoadingPage>
  );
}

export function HoldingsLoading() {
  return (
    <LoadingPage label="loading your holdings…">
      <Heading />
      <div className="filters skeleton-filters">
        {Array.from({ length: 8 }, (_, i) => (
          <div className={i === 0 ? "search" : "skeleton-filter"} key={i}>
            <Line className="skeleton-caption" />
            <Line className="skeleton-control" />
          </div>
        ))}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {Array.from({ length: 11 }, (_, i) => (
                <th key={i}>
                  <Line className="skeleton-cell" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={i}>
                {Array.from({ length: 11 }, (_, j) => (
                  <td key={j}>
                    <Line className="skeleton-cell" />
                    {j < 3 && <Line className="skeleton-caption" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Line className="skeleton-footnote" />
      <section className="panel">
        <Line className="skeleton-section-title" />
        <Line className="skeleton-footnote" />
        <Line className="skeleton-control" />
      </section>
    </LoadingPage>
  );
}

export function AccountsLoading() {
  return (
    <LoadingPage label="loading your accounts…">
      <Heading />
      <div className="account-list">
        {Array.from({ length: 2 }, (_, i) => (
          <section className="account" key={i}>
            <div className="account-top">
              <Skeleton className="ledger-skeleton skeleton-broker" />
              <div>
                <Line className="skeleton-section-title" />
                <Line className="skeleton-caption" />
                <Line className="skeleton-caption" />
              </div>
            </div>
            <div className="account-body">
              <div>
                <Line className="skeleton-caption" />
                <Line className="skeleton-caption" />
              </div>
              <Line className="skeleton-prose" />
            </div>
            <div className="account-actions">
              <Line className="skeleton-control skeleton-action" />
              <Line className="skeleton-control skeleton-action" />
            </div>
          </section>
        ))}
      </div>
      <Line className="skeleton-footnote" />
    </LoadingPage>
  );
}

export function SettingsLoading() {
  return (
    <LoadingPage label="loading your settings…">
      <Heading health={false} />
      <section className="panel">
        <Line className="skeleton-section-title" />
        <Line className="skeleton-footnote" />
        <Line className="skeleton-caption" />
        <Line className="skeleton-control" />
        <Line className="skeleton-control skeleton-action" />
        <Line className="skeleton-footnote" />
      </section>
      <section className="panel">
        <Line className="skeleton-section-title" />
        <Line className="skeleton-footnote" />
        <Line className="skeleton-control" />
        <Line className="skeleton-footnote" />
        <Line className="skeleton-prose" />
        <Line className="skeleton-control" />
        <Line className="skeleton-control skeleton-action" />
      </section>
      <section className="panel">
        <Line className="skeleton-section-title" />
        <div className="security-list">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Line className="skeleton-caption" />
              <Line className="skeleton-description" />
            </div>
          ))}
        </div>
        <Line className="skeleton-control skeleton-action" />
      </section>
    </LoadingPage>
  );
}
