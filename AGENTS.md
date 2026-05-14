# AGENTS.md

## Design intent
Build a premium, practical, conversion-oriented fulfillment website.

Target feel:
- ShipMonk structure, hierarchy, spacing, and proof
- Kak2c specificity, service clarity, and marketplace relevance

Do not copy either source literally.
Use them only as directional references.

---

## Core principle
Prefer clarity over decoration.

Every page should feel:
- credible
- structured
- modern
- commercially serious
- operationally clear

When in doubt, choose:
- the cleaner option
- the more businesslike option
- the more understandable option
- the more trust-building option

---

## Cross-skill workflow
Use the project skills together whenever a page needs both visual quality and functional site consistency.

- Start with `design-identity` for visual tone, composition, and brand-aligned page hierarchy.
- Use `design-consistency` to keep new or edited sections aligned with existing layout patterns, spacing tokens, and site rhythm.
- Use `section-visual-balance` when creating or editing multi-column sections, card layouts, or asymmetric compositions to ensure balanced alignment, proper grid structure, and removal of layout hacks.
- Apply `seo-optimization` to verify page intent, semantic structure, heading hierarchy, metadata, internal links, images, and share preview readiness.
- Use `translation-system` when any UI text is multilingual, to keep translation keys consistent and data-i18n markup correct.
- Use `image-prompt-generator` when visual assets or imagery prompts are required, ensuring images match the page identity and SEO preview needs.
- Use `maintenance-system` when creating, updating, enabling, disabling, or reviewing a maintenance page or temporary maintenance-mode fallback. Combine it with `translation-system`, `seo-optimization`, `design-consistency`, and `performance` whenever the maintenance page touches multilingual copy, indexation, layout, or loading behavior.

This workflow is not linear; use the relevant skill at each stage and revisit others as the page evolves.

---

## Visual direction
- Use clean enterprise-style layouts
- Keep strong hierarchy and generous spacing
- Use restrained colors and clear contrast
- Make the UI feel premium but grounded
- Keep visuals relevant to logistics, fulfillment, marketplaces, warehousing, or operations

Avoid:
- generic startup SaaS styling
- noisy gradients
- excessive decoration
- cluttered sections
- flashy motion
- template-looking UI

---

## Layout rules
- Build pages as clear business sections
- Keep a calm top-to-bottom reading flow
- Prefer 2-column and 3-column layouts
- Use cards only when they improve scanning
- Keep section spacing generous and consistent
- Every section must be based on a clear layout system, not on manual visual guessing
- Use CSS Grid or Flexbox for composition
- Use parent `gap` for spacing between layout children
- Avoid child margins as the main way to create layout spacing
- Do not create visual balance with random `margin-top`, `margin-left`, `transform`, empty spacer divs, or hardcoded heights
- Do not leave unexplained empty areas inside or around sections
- All major elements in a section must align to a visible composition logic: shared grid, shared axis, shared baseline, or shared container

Preferred section order:
1. Hero
2. Trust / logos / marketplaces
3. Services or benefits
4. Proof / metrics / case snippets
5. Process / platform / integrations
6. CTA
7. FAQ or final reassurance

---

## Section structure rules
Every page section must follow this structure unless the existing project architecture requires a different established pattern:

```html
<section class="section section--name">
  <div class="container">
    <div class="section__inner">
      ...
    </div>
  </div>
</section>
```

Rules:
- `.section` controls vertical section padding
- `.container` controls max-width and horizontal page padding
- `.section__inner` or a named layout wrapper controls internal section composition
- Individual child elements must not create outer page spacing manually
- Do not use random margins to push blocks into place
- Do not use absolute positioning for normal content layout
- Do not use negative margins for normal section alignment
- Do not use `transform: translate(...)` to fix layout problems
- Do not use empty divs as spacers

Good:

```scss
.section__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
  gap: var(--space-8);
  align-items: center;
}
```

Bad:

```scss
.card {
  margin-top: 87px;
  margin-left: 43px;
}
```

---

## Spacing discipline
Use spacing tokens only.

Spacing must come from:
- section padding
- container padding
- grid/flex `gap`
- reusable spacing tokens

Do not use arbitrary spacing values unless they already exist in the design system or are explicitly required.

Avoid values like:
- `37px`
- `83px`
- `112px`
- `14rem`
- `calc(...)` used only to visually force alignment

Use tokenized values like:

```scss
padding-block: var(--section-padding);
gap: var(--space-5);
margin-bottom: var(--space-4);
```

If spacing tokens are missing, add or reuse a small, consistent scale instead of inventing one-off values.

Recommended spacing scale:

```scss
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
```

Rules:
- Use `gap` for spacing between cards, columns, rows, and repeated elements
- Use margins only for simple text rhythm or when already established by the project
- Do not mix many unrelated spacing values inside one section
- Top and bottom padding of a section must feel intentionally balanced
- If a section has asymmetry, it must be created by grid composition, not random offsets

---

## Grid-first composition
For complex sections with text, cards, images, metrics, or mixed content, use CSS Grid first.

Rules:
- The main section layout should be controlled by one parent grid
- Nested card groups should use their own grid or flex layout
- Cards should not be placed manually with individual offsets
- Large and small cards must relate to the same grid system
- Asymmetric layouts must use explicit grid columns, rows, or grid areas
- Do not let a card “float” without a clear relationship to nearby elements

Example for a section with text on the left and cards on the right:

```scss
.section__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
  gap: var(--space-8);
  align-items: center;
}

.section__content {
  max-width: 520px;
}

.section__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}
```

For asymmetric card layouts, use named grid areas:

```scss
.metrics-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas:
    "main side-top"
    "main side-bottom"
    "bottom side-bottom";
  gap: var(--space-5);
  align-items: stretch;
}

.metrics-card--main {
  grid-area: main;
}

.metrics-card--side-top {
  grid-area: side-top;
}

.metrics-card--bottom {
  grid-area: bottom;
}

.metrics-card--side-bottom {
  grid-area: side-bottom;
}
```

---

## Card layout rules
Cards must be placed inside a parent grid or flex wrapper.

Do not position individual cards manually.

Avoid:
- each card having its own unrelated `margin-top`
- one card being pushed down manually
- cards having unrelated widths
- cards being aligned by visual guessing
- large empty areas inside cards unless intentionally part of the composition
- hardcoded card heights used only to create fake balance

Good:
- cards are placed in a named grid
- all gaps come from the parent grid
- card widths are controlled by grid columns
- card height differences are intentional
- visual hierarchy is clear
- the largest card anchors the composition
- smaller cards align to shared grid rows or columns

Card content rules:
- Card padding must use spacing tokens
- Card text should align consistently
- Card title, body, and optional icon/visual must follow the same internal rhythm
- If a card has a large internal empty area, it must serve a clear visual purpose
- Do not use blank space as decoration unless the section composition clearly supports it

---

## Visual balance check
Before considering any section complete, check and fix:

- excessive empty space above content
- excessive empty space below content
- excessive empty space between columns
- one column ending early while the neighboring column or card grid continues lower
- left/right column bottom edges that do not look intentionally related
- cards that do not align with nearby cards
- cards floating without grid logic
- text blocks that feel disconnected from visuals
- inconsistent gaps between similar elements
- large internal empty areas inside cards
- manual margins used to force alignment
- visual weight concentrated too heavily on one side
- unclear section rhythm on desktop, tablet, or mobile

A section is not acceptable if it looks manually arranged rather than designed on a layout system.

When auditing multi-column sections, do not rely only on CSS structure or overflow checks. Inspect the rendered section screenshot and verify that the visible top/bottom edges of columns, cards, and grids form an intentional composition. If one side ends early and leaves a large unexplained empty area, the section fails `section-visual-balance` even if it uses grid, gap, and responsive rules correctly.

For each audited multi-column section, report one of:
- balanced
- balanced with intentional asymmetry
- failed due to early column ending / unexplained empty area
- failed due to manual layout hack
- failed due to responsive collapse issue

**See the `section-visual-balance` skill for detailed audit checklist and fix patterns.**

---

## Operational supports section pattern
For sections like “key operational supports”, use this layout pattern:

- left column: label, heading, short paragraph
- right column: card composition
- parent layout: two-column grid
- vertical alignment: center or clearly intentional start alignment
- no large unexplained empty space above or below the text block
- card composition must be controlled by CSS Grid
- the largest card should anchor the composition
- smaller cards should align to the same grid rows or columns
- all spacing must come from tokens and `gap`
- the section must not contain decorative empty space unless it is clearly part of the design

---

## Hero rules
- One specific headline
- One supporting paragraph
- One primary CTA
- Optional secondary CTA
- One relevant visual
- Optional metrics row

The hero must clearly communicate:
- what the company does
- for whom
- why it is trustworthy
- what business result it improves

Avoid:
- vague slogans
- abstract innovation language
- too many CTAs
- long paragraphs

---

## Proof rules
Introduce trust early.

Use:
- client or partner logos
- marketplace logos
- metrics
- short testimonials
- integrations
- process credibility
- case results

Proof should be:
- easy to scan
- visually clean
- secondary to the main offer
- realistic and business-relevant

Avoid:
- fake vanity metrics
- huge testimonial walls
- low-trust review carousels

---

## CTA rules
CTAs should feel strong, clear, and professional.

Preferred CTA language:
- Get a quote
- Request pricing
- Speak to an expert
- Calculate cost
- Discuss your workflow

Rules:
- one main CTA per section
- clear visual priority
- enough whitespace around CTA blocks
- no desperate sales tone

Avoid:
- too many CTA buttons
- manipulative urgency
- repeated identical forms across the page

---

## Forms
- Keep forms simple and useful
- Ask only for necessary information
- Group fields clearly
- Use one obvious submit action

Avoid:
- long intimidating forms
- repeated lead forms every few sections
- unnecessary required fields

---

## Typography and copy
- Use strong heading hierarchy
- Keep paragraphs short
- Write clear, commercially literate copy
- Sound practical, reliable, and businesslike
- Focus on value, process, and trust

Avoid:
- buzzwords
- hype language
- emotional fluff
- abstract branding copy with no substance

---

## Motion
Use subtle motion only.

Allowed:
- soft fades
- small reveals
- restrained hover states
- light transitions

Avoid:
- dramatic scroll animation
- heavy parallax
- decorative motion that slows understanding

---

## Responsiveness
On mobile:
- preserve hierarchy first
- stack sections cleanly
- keep cards easy to scan
- reduce decorative visuals before reducing clarity
- make CTA and proof blocks immediately readable
- remove complex desktop asymmetry when it hurts clarity
- keep spacing tighter but still consistent
- avoid leaving orphaned cards or isolated text blocks
- ensure all grids collapse predictably

Responsive layout rules:
- Desktop: use the full grid composition
- Tablet: simplify columns if the layout starts feeling compressed
- Mobile: stack content in a logical reading order
- Do not preserve desktop offsets on mobile
- Do not use fixed heights that break content flow
- Cards should become one column when two columns hurt readability

---

## Non-negotiables
- Reuse existing components and design tokens
- Maintain consistent spacing and hierarchy
- Keep the page cleaner than Kak2c
- Keep the page warmer and more practical than ShipMonk
- Avoid generic SaaS visuals
- Design for trust and conversion, not visual spectacle
- Do not use arbitrary margins, padding, transforms, or absolute positioning to fix normal layout problems
- Do not create section layouts by visual guessing
- Do not leave unexplained empty areas in sections
- Do not accept valid grid/flex code as visually balanced until rendered column boundaries have been checked
- Use parent grid/flex layout and `gap` as the main spacing system
- Every section must look intentional, balanced, and based on a reusable composition system

---

## Design System Components

The design system is organized into reusable components to ensure consistency across the site. All components use design tokens from `_vars.scss` and follow BEM naming conventions.

### Core Components

#### Buttons (`_buttons.scss`)
- `.button` - Base button styles
- `.button--primary` - Primary CTA button
- `.button--secondary` - Secondary button
- `.button--small` - Smaller button variant
- `.button--full` - Full-width button

#### Cards (`_cards.scss`)
- `.card` - Base card component
- `.card--surface` - Card with surface background
- `.card--accent` - Card with accent background
- `.card--transparent` - Transparent card with blur effect
- `.card--special` - Extended service card with icon and content grid
- `.card--special-light` - Light variant of special card
- `.card--special-accent` - Accent variant with gradient background
- `.card__title` - Card title
- `.card__text` - Card text content
- `.card__value` - Card value/metric
- `.card__list` - List element for special cards
- `.card__meta` - Meta tags wrapper for special cards

#### Sections (`_sections.scss`)
- `.section` - Section wrapper with padding
- `.container` - Max-width container
- `.section__inner` - Section inner layout
- `.section-heading` - Section heading block
- `.section-heading--wide` - Wider heading variant

#### Typography (`_typography.scss`)
- Base typography styles for body, headings, links
- Utility classes: `.text-muted`, `.text-accent`, `.text-center`, etc.

#### Forms (`_forms.scss`)
- `.form-field` - Form field wrapper
- `.form-label` - Form label
- `.form-input`, `.form-textarea`, `.form-select` - Form inputs
- `.form-group` - Form wrapper
- `.form-actions` - Form action buttons

### Usage Guidelines

- Always use components from the design system instead of creating new styles
- Extend components with modifiers (e.g., `.card--variant`) rather than overriding
- Use CSS variables for spacing, colors, and other tokens
- Components are responsive by default using the established breakpoints
- Test components in `uikit.html` before using in production pages

### Adding New Components

When adding new components:
1. Create a new SCSS file in `src/scss/components/`
2. Add import to `components/index.scss`
3. Document in this section
4. Add examples to `uikit.html`
5. Ensure responsive behavior follows project rules

Use `uikit.html` as the canonical reference for component classes and layout patterns when editing pages or creating new sections.

---

## Skill usage
Use the `design-identity` skill for:
- asset-based visual references
- section-level execution
- CTA/form styling details
- mobile block behavior
- final design validation against reference screenshots

Use the `design-identity` skill especially when:
- creating a new section from scratch
- adapting a reference layout
- creating an asymmetric card composition
- checking whether spacing, hierarchy, and visual weight feel balanced
- validating desktop/tablet/mobile behavior

The skill should guide section-level design thinking, but permanent project rules from this file must always take priority.

Use the `section-visual-balance` skill for:
- creating or heavily editing multi-column sections
- card-based layouts and asymmetric compositions
- fixing visual weight imbalances between columns
- auditing grid and alignment issues
- removing layout hacks (random margins, transforms, absolute positioning)
- validating responsive grid behavior on tablet and mobile
- before finalizing any section with two or more columns

Use the `section-visual-balance` skill especially when:
- a section feels visually off but the issue is unclear
- left/right columns have uneven heights or misaligned content
- cards are positioned manually instead of using grid
- there are unexplained empty areas inside sections
- desktop layout breaks awkwardly on mobile/tablet
- spacing appears arbitrary rather than system-based

Use the `scroll-reveal-animations` skill for:
- implementing scroll-triggered entrance animations on page elements
- staggered reveal timing across card grids, hero sections, or multi-element layouts
- directional fade animations (up, down, left, right) based on element position
- performance-optimized IntersectionObserver implementation
- accessibility-aware animations that respect `prefers-reduced-motion` settings

Use the `scroll-reveal-animations` skill especially when:
- creating hero or service sections with multiple content blocks
- building card grids that benefit from progressive reveal
- designing pages where staggered timing improves visual narrative
- needing GPU-accelerated, jank-free scroll animations
- working with asymmetric layouts where animation direction matters

Use the `maintenance-system` skill for:
- creating or updating a maintenance page
- enabling or disabling a temporary maintenance-mode fallback
- adding maintenance-page logo, unavailable-site message, contact block, or language switcher
- validating maintenance-specific metadata, `noindex`, `503`/`Retry-After` guidance, and fallback behavior
- keeping the page lightweight, contactable, multilingual, and aligned with the project design system

Use the `maintenance-system` skill together with:
- `translation-system` when the page has multilingual copy or language buttons
- `seo-optimization` when metadata, canonical/indexation, or public maintenance responses are changed
- `design-consistency` when adding page layout or SCSS
- `section-visual-balance` when the maintenance layout uses multiple columns or contact cards
- `performance` when adding assets, scripts, fonts, or deployment rules

---

## Frontend conventions
- Use BEM-style class naming
- Keep HTML semantic and section-based
- Prefer container > section > inner > grid structure
- Use spacing tokens only
- Do not use arbitrary margin/padding values unless already tokenized
- Reuse existing utilities and components
- Keep SCSS modular and split by purpose
- Avoid deeply nested selectors
- Prefer parent-controlled layout using grid/flex and `gap`
- Avoid layout hacks such as negative margins, absolute positioning, empty spacers, and transform-based alignment
- Keep class names meaningful and tied to the section/component purpose
- Use modifiers for visual variations, not one-off layout fixes

Recommended BEM structure:

```html
<section class="section section--metrics">
  <div class="container">
    <div class="metrics-section__layout">
      <div class="metrics-section__content">
        ...
      </div>

      <div class="metrics-section__grid">
        <article class="metrics-card metrics-card--main">
          ...
        </article>
      </div>
    </div>
  </div>
</section>
```

Recommended SCSS structure:

```scss
.metrics-section {
  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
    gap: var(--space-8);
    align-items: center;
  }

  &__content {
    max-width: 520px;
  }

  &__grid {
    display: grid;
    gap: var(--space-5);
  }
}

.metrics-card {
  padding: var(--space-6);
  border-radius: var(--radius-lg);

  &--main {
    // modifier styles only
  }
}
```

Avoid:

```scss
.metrics-card:nth-child(2) {
  margin-top: 73px;
}

.metrics-card:nth-child(3) {
  transform: translateX(40px);
}

.metrics-section__content {
  padding-top: 118px;
}
```

---

## i18n
This project uses `scripts-js-php/lang.json` and `scripts-js-php/translation.js`.
Use `data-i18n` for translatable UI.
Keep translation keys consistent across all supported languages.
Use the `translation-system` skill when creating or updating multilingual UI.

---

## SEO

When creating or editing website pages, use the `seo-optimization` skill.

Every page must have a clear SEO structure: unique title, meta description, one H1, logical heading hierarchy, semantic HTML, optimized images, canonical URL where needed, Open Graph tags, and relevant structured data.

Do not keyword-stuff, generate fake reviews, add misleading schema markup, or use SEO hacks that reduce content quality.

---

## Done when
A page is successful only if it:
- feels premium but grounded
- communicates logistics competence fast
- is easy to scan
- uses proof early
- presents services clearly
- has one obvious conversion path
- looks structured, modern, and credible
- uses consistent spacing tokens
- uses parent grid/flex layout instead of random child margins
- has no unexplained empty areas
- has no cards floating outside a clear layout system
- has balanced top/bottom section padding
- has predictable responsive behavior
- looks intentionally composed on desktop, tablet, and mobile

A section is not done if:
- it relies on random margins to look correct
- it has large accidental blank zones
- cards are positioned manually
- visual balance depends on hardcoded heights
- desktop layout breaks or feels awkward on tablet/mobile
- the composition feels like separate blocks placed near each other instead of one designed section
