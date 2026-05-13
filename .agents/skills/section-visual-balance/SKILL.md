---
name: section-visual-balance
description: Use this skill when creating or significantly editing multi-column sections to ensure visual balance, correct vertical alignment, proper grid composition, and removal of layout hacks. Apply it to two-column, three-column, and asymmetric card layouts where left and right (or top and bottom) parts may have uneven height, misaligned content, or composition issues.
---

# Section Visual Balance Skill

## Goal

Ensure every multi-column or card-based section:
- Has balanced visual weight across columns
- Uses proper grid alignment instead of manual margins
- Contains no unexplained empty areas
- Has predictable behavior on desktop, tablet, and mobile
- Looks intentionally designed, not randomly arranged

---

## Required Workflow

When creating or heavily editing a section with two or more columns, card layouts, or asymmetric compositions, follow this process:

### 1. Identify the composition type

Before auditing, determine:
- Is it a two-column layout (text + visual, content + cards)?
- Is it a three-column layout (equal or asymmetric)?
- Is it a card grid with different card sizes?
- Are cards placed in a specific pattern (e.g., one large + smaller cards)?

---

### 2. Verify grid-based layout

Check the section SCSS:

**Good (grid-controlled):**
```scss
.section__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
  gap: var(--space-8);
  align-items: center;
}
```

**Bad (margin-driven):**
```scss
.card {
  margin-top: 73px;
  margin-left: 40px;
}
```

Rules:
- The parent layout must use `display: grid` or `display: flex`.
- Child spacing must come from `gap`, not from child margins.
- If asymmetric layout: use named grid areas (`grid-template-areas`).
- All columns must have defined widths using `grid-template-columns` or flex proportions.
- `align-items` must be set intentionally (`center`, `start`, `stretch`, etc.), not left to default.

---

### 3. Check vertical alignment

For multi-column sections:

- **Text + visual side-by-side**: Use `align-items: center` so text centers on the visual.
- **Content grid + card grid**: Use `align-items: start` if content is small, or `align-items: stretch` if heights should be equal.
- **Mixed heights**: If cards have different heights, it must be intentional (not accidental content overflow).
- **One large card + smaller cards**: Use `grid-template-areas` to anchor the large card and align smaller ones to its rows.
- `align-items: start` is not automatically acceptable. Verify that the rendered result still looks intentionally composed.

**Test alignment:**
- Open DevTools.
- Enable CSS Grid overlay (DevTools → Elements → Grid badge).
- Check that all children snap to visible grid lines.

---

### 4. Mandatory visual boundary check

Code-level grid correctness is not enough. A section can use valid grid/flex and still fail visual balance.

For every two-column or asymmetric section, inspect the rendered section and compare visible boundaries:

- Compare the visual bottom edge of the left column and the right column.
- If one column ends significantly higher than the other and leaves an empty zone with no meaningful content, treat it as a balance issue.
- If a text column contains a summary/card and the opposite column contains a card grid, the summary/card should usually align with the bottom of the opposite grid or the section should use clearly intentional centered alignment.
- Passing `scrollWidth === clientWidth` only proves there is no overflow; it does not prove visual balance.
- If a screenshot can be annotated with a horizontal line showing one side stops too early, the section needs review.

Flag as a problem when:

- A column leaves empty vertical space larger than `var(--space-7)` below its last meaningful element.
- A lower edge appears visually accidental compared with the neighboring column.
- A card/grid row continues below the adjacent content with no balancing content, CTA, metric, note, or image.
- The layout looks correct in CSS but the rendered screenshot reads as separate blocks placed near each other.

Preferred fixes:

- Use `align-items: stretch` on the parent grid when columns should share the same height.
- Split the shorter column into a nested grid.
- Use `align-content: space-between` when top copy and bottom summary should anchor the column.
- Add meaningful supporting content if the short column is underdeveloped.
- Adjust grid ratios only after the vertical composition is solved.

Do not fix this with:

- `margin-top`
- `transform`
- hardcoded heights
- empty spacer elements
- decorative blank space

---

### 5. Audit section padding

Check `.section` padding:

```scss
.section {
  padding-block: var(--section-padding); // defined in _vars.scss
}
```

Rules:
- Top padding and bottom padding must feel intentionally balanced.
- If asymmetric, it must be documented and justified.
- No section should have `padding-top: 87px` or arbitrary values.

Check visually:
- Is there excessive empty space above the section content?
- Is there excessive empty space below?
- If the section has multiple blocks, do they feel equally spaced?

---

### 6. Check internal card padding

For card-based layouts:

```scss
.card {
  padding: var(--space-6);
}
```

Rules:
- Card padding must use spacing tokens (e.g., `--space-4`, `--space-6`).
- Internal content (text, icon, value) must not have arbitrary margins.
- If a card feels empty, check if padding is too large or content is too small.

**Do not create fake balance by:**
- Adding `height: 280px;` to make cards tall
- Adding empty `<div></div>` spacers inside cards
- Using `padding-bottom: 120px;` to force space

---

### 7. Verify no layout hacks

Forbidden patterns in section SCSS:

```scss
// ❌ DO NOT DO THIS:
.card:nth-child(2) {
  margin-top: 73px;
}

.card:nth-child(3) {
  transform: translateY(40px);
}

.section__text {
  position: absolute;
  top: 120px;
  left: 50px;
}

.spacer {
  height: 64px; // used only to fake spacing
}

.section__content {
  margin-bottom: -30px; // negative margin hack
}
```

**Instead:**
- Use grid with proper column/row definitions.
- Use `gap` for spacing.
- Use `align-items` and `justify-items` for alignment.
- Use CSS Grid areas for asymmetric layouts.

---

### 8. Audit visual weight distribution

On desktop and mobile:

- [ ] Is one column dominating the section (taking up 70%+ of visual space)?
- [ ] Are cards of wildly different sizes without clear reason?
- [ ] Is all the content crammed into one column while the other is empty?
- [ ] Are text blocks shorter than cards, making them look orphaned?
- [ ] Does one column end early while the adjacent card grid continues below it?
- [ ] Is there a clear visual focal point, or does the eye bounce randomly?

**Fix:**
- Adjust grid column ratios (e.g., `1fr 1.4fr` instead of `1fr 2fr`).
- Pair short text with more cards/visuals, or expand text to fill space.
- Add more content to a sparse column.
- Use image or visual elements to balance text-heavy columns.

---

### 9. Check for unexplained empty areas

Inside sections:

- [ ] Is there large empty space inside a card that serves no purpose?
- [ ] Is there an empty zone between columns (not the `gap`)?
- [ ] Is there a large empty zone below a shorter column because the neighboring column continues farther down?
- [ ] Is the right edge of a column floating without alignment?
- [ ] Are cards clearly related by a visible grid, or do they look scattered?

**Fix:**
- Remove empty space by reducing card padding or adjusting content.
- Ensure gap comes from `gap`, not from spacing between blocks.
- Align all elements to a shared grid.
- If asymmetric, use `grid-template-areas` to make the relationship explicit.

---

### 10. Check responsive behavior

**Tablet and mobile:**

- [ ] Does the two-column layout collapse to one column predictably?
- [ ] Do card grids reflow without orphaned cards?
- [ ] Is text still readable?
- [ ] Are buttons still tappable?
- [ ] Is there horizontal scroll?
- [ ] Do cards become very tall or very wide without reason?

**Example responsive grid:**

```scss
.section__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
  gap: var(--space-8);
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
}
```

Rules:
- Desktop: full layout with multiple columns.
- Tablet (768px and below): simplify to fewer columns if the layout feels compressed.
- Mobile (480px and below): usually one column, stacked content.
- Do not preserve desktop offsets or asymmetry on mobile.
- Section padding may be tighter on mobile but must still use tokens.

---

### 11. Final balance check

Before marking the section complete, verify:

- [ ] The section looks balanced on desktop (150%, 100%, 75% zoom levels).
- [ ] In rendered screenshots, left and right column bottom edges look intentionally related.
- [ ] No column ends early leaving a large unexplained empty zone below it.
- [ ] `align-items: start` has been visually verified, not accepted only because the CSS is valid.
- [ ] Desktop screenshots are inspected for visible top/bottom alignment, not only overflow.
- [ ] No random margins, padding, or transforms are used for alignment.
- [ ] All grid and flex layouts are explicit and documented.
- [ ] Responsive behavior is intentional and tested.
- [ ] No cards are "floating" without a clear grid relationship.
- [ ] All spacing comes from tokens and parent `gap`.
- [ ] Empty areas inside cards or between columns serve a clear visual purpose.
- [ ] The section feels part of the same design system, not a separate template.
- [ ] Visual weight is distributed intentionally, not by accident.

For each audited multi-column section, report one of:

- `balanced`
- `balanced with intentional asymmetry`
- `failed: early column ending / unexplained empty area`
- `failed: manual layout hack`
- `failed: responsive collapse issue`

---

## Common Issues & Fixes

### Issue: Right column is much taller than left
**Cause:** Content-driven height, left text is small.
**Fix:**
- Either expand left text / add more content.
- Or switch to `align-items: start` to detach the columns.
- Or use `align-items: stretch` if columns should fill equally.
- If the left column contains a summary card, split the column into a nested grid and use `align-content: space-between` so the summary aligns with the bottom of the neighboring grid.

### Issue: Left text block is one sentence, right has full card grid
**Cause:** Unbalanced content distribution.
**Fix:**
- Expand left text with more explanation.
- Add supporting details, benefits list, or smaller visual.
- Adjust grid column ratio (e.g., `1fr 1.2fr` instead of `0.8fr 1.5fr`).

### Issue: Cards don't align; some stick out
**Cause:** No parent grid, each card has independent margins.
**Fix:**
- Wrap cards in `.cards-grid`.
- Use `display: grid; grid-template-columns: repeat(N, 1fr); gap: var(--space-5);`.
- Remove all individual card `margin-*` properties.

### Issue: Large empty space inside a card
**Cause:** Hardcoded `height: 300px;` or excessive padding.
**Fix:**
- Remove the height constraint.
- Reduce padding if intentionally large.
- If space is meant to be there, document it in a comment why (e.g., "visual balance with adjacent tall card").

### Issue: Section padding feels unbalanced (too much space above, too little below)
**Cause:** `padding-block` is not balanced, or section-specific overrides exist.
**Fix:**
- Use consistent `padding-block: var(--section-padding);` on all sections.
- If asymmetry is needed, use `padding-top` and `padding-bottom` with separate token values.

### Issue: Mobile layout has orphaned cards or text that's too wide
**Cause:** No responsive grid adjustment.
**Fix:**
- Add `@media (max-width: 768px)` rule.
- Change to `grid-template-columns: 1fr;` (single column).
- Reduce gap and padding proportionally: `gap: var(--space-5);`.

---

## When to Use This Skill

- **Creating a new multi-column section** — before final commit.
- **Significantly editing an existing section** — before marking as done.
- **Fixing layout issues** — when margins are random, alignment is off, or sections look manually placed.
- **Responsive refactor** — when collapsing desktop layout for mobile/tablet.
- **Design review** — when a section "feels off" but you can't pinpoint why.

**Do not use this skill for:**
- Single-column sections with simple text (those use `design-consistency`).
- Pure content edits without layout changes.
- Component-level styling (buttons, typography) — use `design-consistency` or component SCSS files.

---

## Integration with Other Skills

This skill works alongside:

- **design-identity** — handles visual tone and asset-based direction; `section-visual-balance` ensures that visual design is built on proper grid and alignment.
- **design-consistency** — ensures the section matches the design system; `section-visual-balance` audits the grid and alignment specifically.
- **seo-optimization** — validates semantic HTML and heading hierarchy; `section-visual-balance` ensures visual hierarchy matches semantic structure.

---

## Checklist for Sign-Off

Section is ready when all items are checked:

- [ ] Section uses grid or flex layout, not manual margins.
- [ ] Vertical alignment (`align-items`) is intentional.
- [ ] All spacing comes from tokens and `gap`.
- [ ] No arbitrary `margin-top`, `margin-left`, transforms, or hardcoded heights.
- [ ] No unexplained empty areas inside cards or between columns.
- [ ] Rendered left/right column bottom edges look intentionally related.
- [ ] No column ends early leaving a large accidental blank zone.
- [ ] `align-items: start` has been visually verified in a screenshot.
- [ ] Section padding (top/bottom) is balanced and tokenized.
- [ ] Visual weight is distributed intentionally.
- [ ] Responsive behavior is tested on desktop, tablet, and mobile.
- [ ] Cards align to a visible grid, not scattered randomly.
- [ ] No decoration empty divs or spacing hacks.
- [ ] Section looks part of the same design system.
