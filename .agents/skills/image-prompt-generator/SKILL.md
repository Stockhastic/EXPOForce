---
name: image-prompt-generator
description: Use this skill when creating high-quality image-generation prompts for GPT Image 2 or similar image models. Apply it to website hero images, section visuals, blog covers, OG images, service illustrations, product-supporting visuals, abstract backgrounds, and branded website imagery. The skill should analyze the page context and design language, then return a clean, production-ready prompt rather than generating the image itself.
---

# Image Prompt Generator Skill

## Goal

Create clear, high-quality, reusable prompts for image generation.

This skill does not generate images directly. Its job is to produce strong prompts that can be copied into GPT Image 2 or another image model.

Every prompt must match the page purpose, the site’s visual style, and the brand tone. The result should feel like part of the same website, not a random stock image or unrelated artwork.

---

## Core Principle

Do not write vague prompts like:

- "make a cool image"
- "modern business photo"
- "nice website illustration"

Instead, always create prompts that define:

1. The purpose of the image.
2. The subject.
3. The composition.
4. The style.
5. The color behavior.
6. The mood.
7. The level of realism or abstraction.
8. Important constraints.
9. The desired aspect ratio or format.

The prompt must be specific enough to produce a useful image, but not overloaded with meaningless adjectives.

---

## Required Workflow

When asked to create an image prompt:

1. Identify the image type.
2. Identify the page or section purpose.
3. Identify the target audience.
4. Identify the brand/design style.
5. Identify the required visual direction.
6. Decide whether the image should be realistic, illustrative, abstract, or mixed.
7. Decide the composition and framing.
8. Decide whether text inside the image is allowed or forbidden.
9. Decide the aspect ratio.
10. Build the final prompt.
11. Return the prompt in a structured format.

Do not skip this workflow.

---

## 1. Supported Image Types

This skill can prepare prompts for:

- Hero image
- Section visual
- Feature/service illustration
- Blog/article cover
- Open Graph image
- Social preview image
- Background texture or abstract visual
- Contact/about page visual
- Process/workflow illustration
- Case study cover
- Product-supporting lifestyle image
- Team/corporate style visual
- Icon/visual concept prompt
- Placeholder art direction prompt

Always identify the image type first.

---

## 2. Context Analysis

Before writing the prompt, identify:

- What page is this for?
- What section is this for?
- What is the main message of the page?
- What should the image communicate?
- Is the goal trust, clarity, emotion, prestige, speed, professionalism, innovation, warmth, or something else?
- Is the audience B2B, B2C, corporate, startup, industrial, legal, medical, logistics, consulting, tech, etc.?
- What action should the image support: learn, trust, contact, buy, sign up, explore, compare?

The image prompt must support the message of the page, not distract from it.

---

## 3. Brand and Design Alignment

Before creating the prompt, infer or inspect the project’s visual language:

- Minimal / editorial / premium
- Corporate / clean / trustworthy
- Tech / futuristic / innovative
- Warm / human / lifestyle
- Industrial / robust / precise
- Luxury / elegant / polished
- Playful / colorful / approachable
- Dark / cinematic / dramatic
- Soft / calm / airy
- Bold / geometric / graphic

Also identify:

- Expected color palette
- Whether the site uses realistic photography, 3D, flat illustration, abstract shapes, or mixed visuals
- Whether the style is spacious or dense
- Whether backgrounds should be neutral or expressive
- Whether people should appear or not

Never write prompts that clash with the site style.

If the site is clean and corporate, do not suggest neon cyberpunk art.
If the site uses realistic visuals, do not suggest cartoon illustration unless requested.
If the site is premium and minimal, do not suggest busy stock-photo aesthetics.

---

## 4. Asset map

This skill can reference local example images stored in:

- `.agents/skills/image-prompt-generator/assets/`

Use this folder for high-quality reference generations that show the tone, composition, lighting, and palette you want the prompt to match.

Naming guidance:
- use descriptive filenames like `hero-warehouse-good.png`, `section-illustration-clean.png`, or `og-card-minimal.png`
- keep the asset names concise and meaningful

How to use:
- add or update reference images in the `assets/` folder
- document each asset in the SKILL if needed
- if the tooling allows image browsing, you can mention the asset filename in the prompt notes

This is especially useful when the skill should follow a specific visual direction or compare multiple good examples.

---

## 5. Good Prompt Structure

Every final prompt should include the following elements where relevant:

### A. Image purpose

State what the image is for.

Examples:

- "Create a website hero image for a fulfillment service."
- "Create a blog cover image for an article about tax optimization."
- "Create an Open Graph cover image for a consulting company service page."

### B. Subject

Describe the main subject clearly.

Examples:

- modern warehouse interior with organized shelving and packaged orders
- business consultant working with documents and laptop in a clean office
- abstract layered forms symbolizing logistics flow
- premium corporate composition with subtle financial/reporting cues

### C. Composition

Specify framing and composition.

Examples:

- wide composition with negative space on the left for website text
- centered composition with one main subject
- split composition with subject on the right and calm empty space on the left
- balanced editorial composition
- close-up, medium shot, top-down, isometric, front view, etc.

### D. Style

Specify visual style clearly.

Examples:

- photorealistic
- high-end editorial photography
- clean 3D illustration
- flat vector illustration
- minimal abstract composition
- premium product visualization
- modern corporate visual

### E. Lighting and mood

Specify the atmosphere.

Examples:

- soft daylight
- premium diffused studio lighting
- clean bright lighting
- calm neutral mood
- confident and professional mood
- futuristic but restrained mood

### F. Color behavior

Tie the prompt to the brand.

Examples:

- use a restrained neutral palette with soft blue accents
- follow a clean white, gray, and deep navy corporate palette
- use warm beige and muted green tones
- keep colors minimal and elegant

### G. Constraints

State what should be avoided.

Examples:

- no text in the image
- no watermarks
- no visible logos
- no cluttered background
- no exaggerated stock-photo poses
- no cartoonish elements
- no overly saturated colors
- no UI mockup overlays unless requested

---

## 5. Good Prompt Structure

A strong prompt usually follows this structure:

1. What the image is for
2. What the image should show
3. How it should be composed
4. What style it should have
5. What lighting/mood/colors it should use
6. What to avoid

Example template:

```txt
Create a [image type] for [page/section purpose]. Show [subject]. Use [composition]. The style should be [style]. Lighting should be [lighting]. The mood should feel [mood]. Use [color palette guidance]. Keep the image [clean/minimal/professional/etc.]. Avoid [undesired elements].
```

---

## 6. Output Format

When generating a prompt, always return the result in this exact structure:

### Image Type
State the image type.

### Purpose
Briefly explain what the image is meant to communicate.

### Recommended Aspect Ratio
Recommend one of these where relevant:
- 16:9
- 4:3
- 3:2
- 1:1
- 9:16
- custom wide hero
- custom OG format

### Final Prompt
Return one clean final prompt in plain text, ready to copy.

### Avoid / Negative Guidance
Return a short list of things to avoid.
This is not a separate negative prompt syntax unless the user requests it. It is just practical guidance.

### Suggested Filename
Return an SEO-friendly filename.

### Suggested Alt Text
Return a short, useful alt text for website use.

### Notes
Optional. Add brief implementation notes only when useful.

Do not return only the prompt without structure.

---

## Related skills

Use this skill together with other project skills when the image output is part of a page design:

- `design-identity` — to align prompt style, color palette, and visual tone with the brand and logistics messaging.
- `design-consistency` — to ensure imagery supports the layout, section spacing, and page rhythm.
- `seo-optimization` — for OG, social preview, or asset metadata guidance to support search and share previews.
- `translation-system` — if the image prompt should account for multilingual text rules or localized asset labels.

These references help create prompts that are useful not only visually, but also in the broader page and SEO context.

---

## 7. Aspect Ratio Guidance

Recommend aspect ratios based on use case:

- Hero image: usually 16:9, 3:2, or wide custom
- Section visual: usually 4:3 or 1:1
- Blog cover: usually 16:9 or 4:3
- OG image: usually 1200x630 style ratio
- Social image: often 1:1 or 4:5
- Background visual: depends on layout, often wide
- Portrait support visual: often 3:4 or 4:5

Always recommend the ratio instead of leaving it undefined.

---

## 8. Text in Images

Default rule: do not include text inside the image unless the user explicitly wants text rendered.

This is especially important for:

- hero visuals
- section visuals
- article illustrations
- abstract background images

Text may be allowed for:
- OG images
- social cards
- poster-like visuals
- explicit headline artwork

If text is allowed, state the exact wording and placement clearly.

---

## 9. Realistic vs Illustrative Direction

Choose the visual direction intentionally.

### Use photorealistic prompts when:
- the site is corporate
- trust and realism matter
- the topic is physical, industrial, logistics, consulting, office, medical, real estate, manufacturing, etc.

### Use illustration prompts when:
- the site already uses illustration
- the concept is abstract or process-oriented
- realism is unnecessary
- a cleaner, more flexible website style is needed

### Use abstract prompts when:
- the goal is atmosphere
- the image supports design rather than explains concrete content
- the site uses premium minimal shapes, gradients, textures, or symbolic visuals

Do not mix directions randomly.

---

## 10. Quality Constraints

Every prompt should aim for output that is:

- visually clean
- commercially usable
- on-brand
- compositionally clear
- not overloaded
- suitable for website use
- not cliché
- not generic stock-photo-looking unless that is explicitly acceptable

Avoid prompts that produce:

- chaotic scenes
- unnecessary details
- weird surreal objects unless requested
- fake-looking hands or faces if people are not necessary
- overdesigned glossy nonsense
- inconsistent color palettes
- visual noise behind website text

---

## 11. Website Hero Prompt Rules

For hero images specifically:

- preserve negative space for text if the layout needs text overlay
- avoid clutter in the center-left or center-right if that is where copy sits
- make the image emotionally clear in under 2 seconds
- keep it visually strong but not overpowering
- avoid tiny details that disappear in responsive layouts
- keep it brand-aligned and homepage-appropriate

Good hero prompt characteristics:

- one clear idea
- clean subject
- controlled background
- stable composition
- useful empty area for UI text

---

## 12. OG / Social Image Prompt Rules

For OG/social visuals:

- composition must work at thumbnail size
- contrast must be strong enough
- avoid tiny details
- allow text only if requested
- prioritize clarity and brand recognition
- use strong but simple composition

If the user asks for an OG image prompt, recommend:
- strong central composition
- limited visual elements
- bold readable hierarchy if text is included

---

## 13. Service Page Image Prompt Rules

For service pages:

The image should help clarify the service and build trust.

Possible prompt directions:

- relevant environment
- professional human activity
- symbolic but concrete service cues
- clean abstract support visual
- process-related illustration

Do not suggest random decorative art if the service needs credibility.

---

## 14. Blog Cover Prompt Rules

For blog covers:

- represent the topic clearly
- avoid visual clichés when possible
- make the image relevant to the article subject
- keep composition simple
- leave room if the publishing system overlays title text
- do not overcomplicate

---

## 15. Anti-patterns to Avoid

Actively avoid writing prompts that are:

1. Too vague.
2. Too generic.
3. Full of meaningless adjectives.
4. Unrelated to the page content.
5. Visually inconsistent with the site.
6. So detailed that they become messy.
7. Missing composition guidance.
8. Missing usage context.
9. Missing aspect ratio.
10. Missing constraints.
11. Asking for random text in the image.
12. Asking for copyrighted poster-like copies.
13. Asking for brand logos unless clearly necessary and allowed.
14. Mixing visual styles without reason.
15. Making every image “futuristic glowing neon gradient 3D”.

---

## 16. Reusable Prompt Templates

### A. Hero Image Template

```txt
Create a website hero image for [brand/page type]. Show [main subject]. Use a [wide / left-negative-space / right-negative-space / centered] composition suitable for a website hero section. The style should be [photorealistic / clean 3D / minimal illustration / abstract premium]. Lighting should be [soft / bright / studio / natural]. The mood should feel [professional / calm / premium / trustworthy / innovative]. Use [palette guidance]. Keep the image clean and uncluttered, with space for headline and call-to-action. No text, no logos, no watermarks, no overly busy background.
```

### B. Section Visual Template

```txt
Create a website section visual for [section purpose]. Show [subject or concept]. Use a clean [composition type] composition. The style should match a [brand style] website. Use [lighting and mood]. Keep the palette within [color guidance]. Make the image clear, minimal, and suitable for a modern web layout. No text, no logos, no visual clutter.
```

### C. Blog Cover Template

```txt
Create a blog cover image for an article about [topic]. Visually represent [main idea]. Use a clean editorial composition suitable for a website article cover. The style should be [photorealistic / illustrative / abstract]. Use [palette guidance] and a [mood] tone. Keep it visually strong at thumbnail size. No text unless requested, no clutter, no watermarks.
```

### D. OG Image Template

```txt
Create an Open Graph image for [page/topic]. Use a simple, high-contrast composition that works well in link previews. Show [subject/concept]. The style should be [style]. Use [brand palette guidance]. Keep the design clear and visually focused. [If text is needed: include the text "...", placed clearly and prominently.] Avoid clutter, tiny details, watermarks, and unrelated elements.
```

---

## 17. When Information Is Missing

If the user request is incomplete, do not stop. Infer a sensible default based on context.

If necessary, assume:

- clean composition
- no text in image
- brand-safe palette
- modern professional style
- website usability over artistic experimentation

But mention important assumptions in the Notes section.

---

## 18. Output Requirements

When finishing, always provide:

1. Image Type
2. Purpose
3. Recommended Aspect Ratio
4. Final Prompt
5. Avoid / Negative Guidance
6. Suggested Filename
7. Suggested Alt Text
8. Notes (optional)

The final prompt must be directly copyable into GPT Image 2.

Do not output analysis-only text.
Do not output vague advice instead of an actual prompt.
Do not say “here is a possible idea” without giving a final ready prompt.

---

## Final Prompt Review Checklist

Before returning the result, verify:

- The image type is identified.
- The purpose is clear.
- The subject is clear.
- The composition is defined.
- The style is defined.
- Lighting/mood are defined.
- The palette is defined or guided.
- The aspect ratio is recommended.
- Unwanted elements are excluded.
- The prompt matches the likely website style.
- The prompt is usable as-is in GPT Image 2.
- A filename is suggested.
- An alt text is suggested.
