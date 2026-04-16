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

Preferred section order:
1. Hero
2. Trust / logos / marketplaces
3. Services or benefits
4. Proof / metrics / case snippets
5. Process / platform / integrations
6. CTA
7. FAQ or final reassurance

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

---

## Non-negotiables
- Reuse existing components and design tokens
- Maintain consistent spacing and hierarchy
- Keep the page cleaner than Kak2c
- Keep the page warmer and more practical than ShipMonk
- Avoid generic SaaS visuals
- Design for trust and conversion, not visual spectacle

---

## Skill usage
Use the `design-identity` skill for:
- asset-based visual references
- section-level execution
- CTA/form styling details
- mobile block behavior
- final design validation against reference screenshots

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

---

## i18n
This project uses `scripts-js-php/lang.json` and `scripts-js-php/translation.js`.
Use `data-i18n` for translatable UI.
Keep translation keys consistent across all supported languages.
Use the `translation-system` skill when creating or updating multilingual UI.

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