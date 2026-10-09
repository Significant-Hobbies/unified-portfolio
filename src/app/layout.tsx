import type { Metadata } from "next";
import Link from "next/link";
import { ownerSession } from "../server/auth";
import { googleReady } from "../server/google";
import { Nav } from "../components/nav";
import "./globals.css";
export const metadata: Metadata = {
  title: "Unified Portfolio",
  description: "Private investment observability",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const signedIn = Boolean(await ownerSession());
  const ready = googleReady();
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://health.sassmaker.com/tracker.js"
          data-key="ahk_pub_a5f420d99d3c8a9dad6e30bb188989248c445cac80cc0aa011399d11b3b79678"
          data-project="app-72bfc54f-c331-409f-b486-ca1382e53e98"
          data-identity="persistent"
          data-endpoint="https://ingest.sassmaker.com/v1/browser"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {signedIn ? (
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
            </div>
          </div>
        ) : (
          <div className="public">
            <header className="public-header">
              <Link href="/" className="brand">
                <span className="brand-mark">u.</span>
                <span>
                  Unified<small>PORTFOLIO</small>
                </span>
              </Link>
              <nav className="public-nav" aria-label="Public">
                <a href="/settings#how">How it works</a>
                <a href="/settings#privacy">Privacy</a>
                <a className="public-pill" href="/settings#sign-in">
                  {ready ? "Sign in" : "Private beta"}
                </a>
              </nav>
            </header>
            <main id="main">{children}</main>
            <footer className="public-footer">
              <div>
                <strong>Unified Portfolio</strong>
                <span>Observe clearly. Stay in control.</span>
              </div>
              <div>
                <a href="/settings?document=privacy">Privacy policy</a>
                <span>A Significant Hobbies project</span>
              </div>
            </footer>
          </div>
        )}
      </body>
    </html>
  );
}
