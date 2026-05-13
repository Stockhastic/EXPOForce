---
name: design-consistency
description: Use this skill when creating, editing, reviewing, or refactoring website sections so that the page looks like one unified design system instead of separate unrelated blocks. Apply it to landing pages, service pages, FAQ sections, hero sections, cards, forms, CTAs, headers, footers, and content blocks.
---

# Design Consistency Skill

## Goal

Make every new or edited section feel like part of the same website.

The result must not look like several unrelated templates stitched together. All work must follow the visual and layout system documented in **AGENTS.md**, not create new systems.

Do not optimize only the current section in isolation. Always check how it relates visually to the sections before and after it.

---

## Required Workflow

When working on any page or section, follow this process:

### 1. Inspect nearby sections first

Before writing new code:

- Read the current page file.
- Inspect at least 1–2 sections above and below the target section if they exist.
- Look for reusable classes, layout wrappers, buttons, cards, typography classes, CSS variables, SCSS mixins, or design tokens.
- Prefer existing components and utilities over creating new unique styles.

Do not create new visual patterns unless the existing system is clearly missing the needed pattern.

---

### 2. Reference AGENTS.md for all design rules

All spacing, typography, colors, cards, buttons, layout patterns, and responsive rules are documented in **AGENTS.md** sections:

- **Spacing discipline** — spacing tokens only
- **Grid-first composition** — layout system
- **Card layout rules** — card placement rules
- **Typography and copy** — heading hierarchy
- **Visual direction** — color and visual style
- **Layout rules** — section structure
- **Hero, Proof, CTA, Forms rules** — component-specific guidelines

Use AGENTS.md as the source of truth. This skill focuses on **workflow and validation**, not rule documentation.

---

### 3. Check for inconsistencies

Actively look for:

- Does this section use the same container width?
- Are headings using the same scale?
- Are buttons the same style?
- Are cards consistent with existing cards?
- Are spacing values tokenized (from AGENTS.md)?
- Do colors come from the existing palette?
- Are grid/flex layouts used instead of manual margins?

If something feels different from nearby sections, it's likely a consistency issue.

---

## Responsive Rules

On mobile, preserve the design logic, not just collapse it.

- Check desktop, tablet, and mobile.
- Make grid columns collapse predictably.
- Keep text readable.
- Reduce oversized section padding on mobile only if needed.
- Avoid huge empty areas on mobile.
- Keep buttons tappable.
- Avoid horizontal scroll.

See **AGENTS.md** for spacing and grid rules. Mobile behavior must follow the same token system.

---

## Multi-column section focus

For sections with **two or more columns**, **card grids**, or **asymmetric layouts**, use `section-visual-balance` skill before finalizing:

- This skill validates grid structure, vertical alignment, and visual balance.
- It audits spacing consistency and removes layout hacks.
- It checks responsive behavior on mobile and tablet.

Do not finalize any multi-column section without running the `section-visual-balance` checklist.

---

## Anti-patterns to Fix

Actively detect and fix these problems during code review:

1. Random section paddings (use tokens).
2. Different container widths (use one per project).
3. Different button styles (reuse existing).
4. Different card radii (use same radius scale).
5. Different shadows (use token-based shadows).
6. Different heading scales (reuse heading hierarchy).
7. Too many background colors (use existing palette).
8. Mixed illustration/photo/icon styles (consistent art direction).
9. Cards with inconsistent internal spacing (use tokens).
10. Decorative elements that appear only once (don't add them).
11. Large accidental empty spaces (justify all gaps).
12. Unbalanced grid alignment (use parent grid, not child margins).
13. Mobile sections with excessive gaps (scale to mobile).
14. CSS values that look arbitrary (use tokens).
15. New CSS variables that duplicate existing ones (reuse).

---

## When Editing Existing Sections

Do not rewrite everything from scratch.

Prefer this order:

1. Reuse existing classes.
2. Normalize spacing (use AGENTS.md tokens).
3. Normalize typography (use AGENTS.md scale).
4. Normalize buttons (use existing button classes).
5. Normalize cards (use existing card styles).
6. Normalize backgrounds (use existing palette).
7. Remove unnecessary wrappers.
8. Remove one-off decorative styles.
9. Improve responsive behavior.
10. Only then adjust content layout.

Keep the HTML semantic and clean.

---

## When Creating a New Section

Before coding, internally answer:

1. What existing section is this visually closest to?
2. What container class should be reused?
3. What heading style should be reused?
4. What button style should be reused?
5. What card/surface style should be reused?
6. What spacing scale should be used (from AGENTS.md)?
7. How will it look on mobile?
8. Does this introduce a new visual language? **If yes, avoid it.**

Then create the section following AGENTS.md layout and spacing rules.

---

## Output Requirements

When finishing the task, report briefly:

1. What existing visual patterns were reused.
2. What was normalized or fixed.
3. Whether any new reusable class, token, or component was introduced (should be rare).
4. Any remaining visual risk or inconsistency.

Do not only say "done".

---
## Related skills

Use this skill together with other project skills when appropriate:

- `design-identity` — for brand alignment, premium logistics layout decisions, and tone consistency.
- `seo-optimization` — for page structure, heading hierarchy, and metadata-aware section editing.
- `translation-system` — for multilingual UI text, data-i18n markup, and translation-safe section updates.
- `image-prompt-generator` — when visual assets or imagery prompts must follow the same page layout and section rhythm.

These skills are complementary. Apply design consistency rules while also considering page purpose, SEO, copy translation, and image direction.

---
## Final Design Review Checklist

Before final answer, verify against **AGENTS.md** rules:

- ✓ Uses the same container width and section padding scale.
- ✓ Headings match the existing type scale.
- ✓ Buttons match existing button styles.
- ✓ Cards match existing card styles or use same grid/padding logic.
- ✓ Colors come from the existing palette.
- ✓ Shadows and radius use tokenized values.
- ✓ All spacing uses `gap` or tokenized margins.
- ✓ Grid or Flexbox controls layout, not random child margins.
- ✓ Images and icons match the existing art direction.
- ✓ No unexplained large gaps.
- ✓ No arbitrary one-off CSS values.
- ✓ No unnecessary new visual system introduced.
- ✓ Desktop, tablet, and mobile layouts are clean and predictable.

If any item fails, the section is not complete.
