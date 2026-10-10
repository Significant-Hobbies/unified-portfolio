"use client";
import Link from "next/link";
import { NavLink } from "./primitives";
import { usePathname } from "next/navigation";
const routes = [
  ["/", "Overview", "◫"],
  ["/holdings", "Holdings", "≡"],
  ["/accounts", "Accounts", "◎"],
  ["/settings", "Settings", "⚙"],
];
export function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Main navigation">
      {routes.map(([href, label, icon]) => (
        <NavLink key={href}>
          <Link href={href} aria-current={path === href ? "page" : undefined}>
            <span aria-hidden="true">{icon}</span>
            {label}
          </Link>
        </NavLink>
      ))}
    </nav>
  );
}
