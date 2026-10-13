import type { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "./nav";

export function AppShell({
  children,
  scripts = false,
}: {
  children: ReactNode;
  scripts?: boolean;
}) {
  return (
    <div className="app">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">u.</span>
          <span>
            Unified<small>PORTFOLIO</small>
          </span>
        </Link>
        <div className="nav-label">YOUR INVESTMENTS</div>
        <Nav />
        <div className="sidebar-bottom">
          <span className="lock">◈</span>
          <div>
            Private by design<small>Read-only connections</small>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <span>Personal investment dashboard</span>
          <span className="owner-mark">Personal workspace</span>
        </div>
        <main id="main">{children}</main>
        <footer>
          Unified Portfolio <span>Observe clearly. Stay in control.</span>
        </footer>
        {scripts && (
          <>
            <script
              src="https://sassmaker.com/project-strip.js"
              data-project="unified-portfolio"
              defer
            />
            <script
              src="https://sassmaker.com/ai-chat-footer.js"
              data-name="Unified Portfolio"
              defer
            />
          </>
        )}
      </div>
    </div>
  );
}
