# Design

A quiet personal investment ledger. Decision, 2026-10-11: use a dark forest-ledger canvas with pale text, lifted forest green actions and amber freshness warnings. The signature is the source ledger: each value sits beside its coverage and connection age. Tabular numbers, generous column alignment and thin rules make holdings easy to scan.

Use system sans-serif for controls and Georgia for primary page titles. Sidebar navigation on desktop becomes a horizontally scrollable labeled navigation on mobile. Keep the existing layout and use the adopted @saas-maker/ui components with app-owned semantic tokens. The sidebar and responsive table structure retain their Preline origins; no Preline runtime dependency. Sources: https://preline.co/docs/components/sidebar.html and https://preline.co/docs/components/tables.html, licensed under MIT for free components (https://preline.co/license.html).

The :root tokens in src/app/globals.css feed @saas-maker/ui and set color-scheme: dark. Palette literals belong only in that token block.

| Token | Value |
| --- | --- |
| background / canvas | #09100d |
| foreground / ink | #edf2ec |
| surface | #0e1612 |
| card / popover | #121a17 |
| muted | #1a231f |
| muted-foreground | #a4b2aa |
| border | #2d3932 |
| brand / primary / positive / ring | #63ba8a |
| brand-foreground / primary-foreground | background |
| brand-soft | #193126 |
| brand-hover | #7bcda0 |
| secondary / sidebar | #16221b |
| accent | #1e3226 |
| accent-foreground / sidebar-accent-foreground | brand |
| input | #6a8072 |
| warning / warning-border | #ebb25f |
| warning-soft | #302619 |
| destructive / negative | #e8796c |
| broker-blue / broker-blue-soft | #95b8ed / #1b283c |
| broker-teal / broker-teal-soft | #8bc5b7 / #18342e |
| broker-olive / broker-olive-soft | #b8ca8d / #2a321d |
| allocation-1 / allocation-2 / allocation-3 | broker-olive / warning / broker-teal |
| backdrop / shadow-near / shadow-far | black at 68% / 20% / 48% |

Card, popover, secondary and sidebar text use foreground. Sidebar active surfaces use brand-soft; sidebar borders and focus use border and ring. Gains remain green, losses red and stale states amber. Chart gridlines use border/muted and the data line uses brand. Focus outline 3px. Controls minimum 44px. Compact tables scroll within their own labeled region. No decorative imagery; charts represent actual snapshot observations only.
