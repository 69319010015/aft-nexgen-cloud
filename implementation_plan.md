# Implementation Plan

Restructure the AFT NexGen Cloud SPA layout to match the Thai-language System Requirements document: move Google Map to bottom, fix sidebar label, and make sidebar sticky/fixed on desktop scroll.

The user provided a detailed One Page Application specification covering sidebar design (fixed `#0F172A` bg with gold glow shadow), four main content sections (Facebook feed, Dashboard, Documents, Google Map), three permission-gated menu groups (General, Student, Teacher), and footer utility controls (theme toggle, logout). The existing codebase at `d:\Project อวท (old 7.16.2026)\aft-nexgen-cloud` already implements ~90% of the spec. Three remaining gaps need to be closed: (1) the Google Map block sits at section 1c instead of being the last section, (2) the sidebar menu label says "ชมรมวิชาชีพปวช.2" but the spec requires "ชมรมวิชาชีพ" only, and (3) the sidebar in desktop mode scrolls with content (`md:static` flex) instead of being fixed-positioned (`md:fixed`) so it stays visible when the user scrolls.

[Types]

No type changes are required. The existing `NavTab`, `FailedStudent`, `Project`, and `SectionItem` types are sufficient for the planned layout changes.

[Files]

Three files will be modified. No new files will be created, and no files will be deleted.

- **`src/app/page.tsx`** — Move the Google Map `<section id="section-map">` block from its current position (after dashboard, before club) to the end of the page layout, just before the login-gated student sections and the closing `</div>`. This involves cutting the block at lines 213-217 and pasting it before line 355 (the start of the Student section). No other content changes needed.

- **`src/components/layout/Sidebar.tsx`** — Two changes:
  1. Change the sidebar menu label on line 60 from `"ชมรมวิชาชีพปวช.2"` to `"ชมรมวิชาชีพ"`.
  2. Make the sidebar fixed-positioned on desktop so it sticks to the screen when the page scrolls. On line 371-377, change the mobile/toggle classes: keep the mobile overlay behavior as-is (`md:static md:z-auto md:shadow-none`), but change desktop to use `md:fixed md:inset-y-0 md:left-0 md:z-40` instead of `md:static`. This ensures the sidebar overlays correctly; the content area must also get a left margin when the sidebar is open.

- **`src/components/layout/ClientLayout.tsx`** — Add a dynamic left margin to the main content area based on `isOpen` state. When the sidebar is open on desktop (`isOpen && window.innerWidth >= 768`), apply `md:ml-64` to shift the content right so the sidebar doesn't overlap. When closed, `md:ml-0`. Must read this file to verify the current structure.

[Functions]

- **`scrollToSection`** in `src/components/layout/Sidebar.tsx` (line 112) — No functional change required; the smooth scroll to section IDs already works correctly with fixed positioning since it uses `scrollIntoView` with the section's `...-mt-4` padding.

- **`handleSubItemClick`** in `src/components/layout/Sidebar.tsx` (line 128) — No functional change; same reasoning as above.

- **`ClientLayout`** in `src/components/layout/ClientLayout.tsx` — Add a new inline style or conditional class to the main wrapper `<div>` to apply `md:ml-64` when the sidebar is open. The `isOpen` prop must be passed from `page.tsx` through `ClientLayout` to its inner div. Currently `ClientLayout` receives no props. Need to check the file to see how it wraps content.

[Classes]

No class definitions need to be added, removed, or modified. The existing React function components (`Sidebar`, `ClientLayout`, `HomePage`) are sufficient.

[Dependencies]

No dependency changes required.

[Testing]

Manually verify three behaviors in the browser after changes:
1. Scroll down the page on desktop — the sidebar should remain fixed in place while the main content scrolls.
2. The Google Map should appear as the last section after all document menus.
3. The sidebar menu should display "ชมรมวิชาชีพ" without "ปวช.2".

[Implementation Order]

1. Read `src/components/layout/ClientLayout.tsx` to understand its current prop structure and wrapper element.
2. Update `ClientLayout.tsx` to accept `isOpen` prop and conditionally apply `md:ml-64` margin to the content wrapper when the sidebar is open on desktop.
3. Update `src/app/page.tsx` to pass `isSidebarOpen` state to `<ClientLayout>`.
4. Move the Google Map section block in `page.tsx` from its current position to the last section before the Student/Teacher sections.
5. Update `src/components/layout/Sidebar.tsx` — change label "ชมรมวิชาชีพปวช.2" to "ชมรมวิชาชีพ".
6. Update `Sidebar.tsx` — change desktop sidebar from `md:static` to `md:fixed` with proper z-index so it stays fixed on scroll.
7. Run `npm run dev` and verify the three behaviors.