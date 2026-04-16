# AGENTS.md

## Purpose of this directory
`base/` contains foundational styling layers and reusable primitives.

This directory should hold:
- variables
- mixins
- reset/base rules
- global typography/font setup
- reusable primitive blocks that are used broadly across the site

---

## What belongs here
Appropriate content for `base/`:
- design tokens
- breakpoint mixins
- animation primitives
- reset styles
- site-wide typography rules
- highly reusable blocks such as cards or schemes when they are truly cross-page primitives

---

## What does not belong here
Do not place page-specific section styling here.

Avoid putting into `base/`:
- one-page-only layouts
- service-page-specific custom sections
- random experiments
- temporary styling hacks

If it only exists for one page section, it probably does not belong in `base/`.

---

## Variables
Add reusable tokens to `_vars.scss`.

Prefer variables for:
- colors
- spacing values that recur
- font sizes
- timing values
- repeated shadows or radii when clearly reused

Do not create tokens for one-off values with no reuse potential.

---

## Mixins
Add reusable responsive or stylistic helpers to `_mixins.scss`.

Use mixins when:
- the pattern is repeated
- the abstraction stays readable
- it helps consistency across the site

Do not create abstractions that make simple CSS harder to understand.

---

## Naming and structure
Keep base files:
- reusable
- clearly scoped
- low in surprise
- not dependent on one page’s exact HTML structure

Prefer stable naming and avoid obscure file purposes. Use BEM methodology.

---

## Dependency rules
Base files should remain broadly reusable.

Avoid creating circular or overly specific dependencies between base files and page-level styles.

---

## Editing philosophy
When touching `base/`:
- assume wide impact
- prefer stable incremental improvements
- preserve existing contracts
- avoid introducing page-coupled behavior

Changes here should strengthen consistency, not spread special-case logic.