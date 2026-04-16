# AGENTS.md

## Purpose of this directory
`partials/` contains shared injected HTML fragments used across multiple pages.

These files are not isolated static snippets.
They are runtime layout components loaded by `scripts/partials.js`.

---

## Files here are shared contracts
Typical partials include:
- header
- footer

Changes here affect multiple pages.
Edit carefully and assume cross-site impact.

---

## Injection rules
These partials are inserted into placeholder nodes already present in page HTML.

Do not casually change:
- expected top-level structure
- root classes
- IDs used by the include system
- selectors expected by global scripts

If the markup contract changes, update the related JS in the same task.

---

## Header rules
Header markup is tied to:
- active link highlighting
- mobile menu initialization
- language switcher logic
- service submenu behavior

Preserve:
- `.header` block naming
- navigation structure
- language switcher structure
- `data-lang` values
- service submenu structure

Do not rename header classes without updating global JS.

---

## Footer rules
Footer should remain:
- shared
- reusable
- content-oriented
- free of page-specific experiments

Do not embed page-specific styles or behaviors into the footer partial.

---

## Contact partial rules
Contact partials are tied to:
- form validation
- submission logic
- success-state rendering
- click tracking
- translation updates

Preserve:
- `.form` block and internal structure
- field `name` attributes
- `.form__status`
- service select values
- contact links and tracking-relevant href patterns

Do not rewrite form semantics unless JavaScript is updated too.

---

## Reviews partial rules
Reviews partials may be tied to Swiper initialization and shared selectors.
Preserve expected Swiper structure when editing review markup.

---

## Naming rules
Use the same BEM-like convention already used in shared partials.

Prefer:
- `header__nav-item`
- `contact__details`
- `footer__list-item`

Avoid introducing unrelated naming systems inside shared partials.

---

## Content rules
Keep partials:
- generic enough for reuse
- structurally clean
- free of one-page hacks
- free of duplicated scripts

Do not place page-specific script tags inside partials.

---

## Editing philosophy
When changing a partial:
- think site-wide
- preserve JavaScript hooks
- preserve translation hooks
- preserve shared block names
- avoid unnecessary structural changes

Small consistent edits are preferred over redesigning shared partials from scratch.