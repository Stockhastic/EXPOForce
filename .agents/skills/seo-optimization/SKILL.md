---
name: seo-optimization
description: Use this skill when creating, editing, reviewing, or refactoring website pages for SEO. Apply it to landing pages, service pages, blog articles, FAQ pages, product/category pages, meta tags, headings, semantic HTML, internal links, images, schema.org JSON-LD, robots.txt, sitemap.xml, canonical URLs, Open Graph tags, multilingual pages, and technical SEO checks.
---

# SEO Optimization Skill

## Goal

Make every page technically correct, understandable for search engines, and useful for real users.

Do not optimize only for keywords. Optimize the full page system: page purpose, structure, metadata, headings, semantic HTML, internal links, images, structured data, indexation, duplication risks, performance risks, and share previews.

The result must be clean, honest, crawlable, indexable when appropriate, and easy to understand.

---

## Core Principle

SEO changes must improve clarity, structure, discoverability, and user value.

Do not use SEO tricks that reduce quality.

Never keyword-stuff, generate fake reviews, add misleading schema, hide text, create doorway pages, or rewrite content into unnatural search-engine text.

---

## Related skills

Use this skill alongside other project skills to make SEO improvements more integrated:

- `design-identity` — to ensure metadata and page structure support the brand, service positioning, and visual content.
- `design-consistency` — to verify that headings, section structure, and content blocks are both visually coherent and semantically correct.
- `translation-system` — for multilingual title/meta support, consistent translation keys, and hreflang/a11y considerations.
- `image-prompt-generator` — when optimizing OG or social preview images, ensure the visual direction matches the page identity.

---

## Required Workflow

When creating, editing, or reviewing a page:

1. Identify the page type.
2. Identify the primary search intent.
3. Check the current HTML structure.
4. Check the title and meta description.
5. Check heading hierarchy.
6. Check semantic HTML.
7. Check internal links.
8. Check images and alt attributes.
9. Check canonical and indexation rules.
10. Check Open Graph and social preview tags.
11. Add relevant schema.org JSON-LD only when appropriate.
12. Check multilingual SEO if the site has multiple languages.
13. Check technical risks: broken links, duplicate content, huge images, layout shift, missing sitemap/robots references.
14. Summarize what was changed and what remains risky.

---

## 1. Page Type

Before editing, classify the page as one of these:

- Home page
- Service page
- Landing page
- About page
- Contact page
- Blog article
- FAQ page
- Product page
- Category page
- Legal page
- Portfolio/case page
- Other

The SEO structure must match the page type.

Example:

- A service page should clearly explain the service, benefits, process, pricing/conditions if relevant, FAQ, and CTA.
- A blog article should have article structure, publication metadata if available, author if relevant, and Article schema if appropriate.
- A contact page should prioritize business details, location, working hours, map, contact methods, and LocalBusiness/Organization schema if appropriate.
- A FAQ page should use clear questions and answers and FAQPage schema only if the FAQ is visible on the page.

---

## 2. Search Intent

Before optimizing content, define the likely user intent:

- Informational: user wants to understand something.
- Commercial: user compares services/products.
- Transactional: user wants to order, contact, buy, book, or request a quote.
- Navigational: user looks for a specific brand, company, or page.
- Local: user looks for a service in a specific location.

The page content must answer that intent quickly.

The first screen must clearly answer:

1. What is this page about?
2. Who is it for?
3. What can the user do here?
4. Why should the user trust this company/site?

---

## 3. Title Tag Rules

Every indexable page must have one unique `<title>`.

Title requirements:

- Must be specific to the page.
- Must include the main topic/service/product.
- Should include brand name when appropriate.
- Should not be duplicated across pages.
- Should not be stuffed with repeated keywords.
- Should be readable as a real search result title.

Preferred length:

- Usually 45–65 characters.
- Slightly longer is acceptable if the title is natural and useful.

Bad:

```html
<title>Services | Services | Best Services | Company</title>
```

Good:

```html
<title>Accounting Services in Armenia | Company Name</title>
```

If the project uses a framework with metadata files or route-based metadata, update the correct metadata location instead of hardcoding tags in the wrong place.

---

## 4. Meta Description Rules

Every important indexable page should have a unique meta description.

Meta description requirements:

- Summarize the page clearly.
- Include the main value proposition.
- Include service/location/product if relevant.
- Use natural language.
- Avoid keyword stuffing.
- Avoid vague text like “Welcome to our website”.

Preferred length:

- Usually 140–160 characters.
- Slightly shorter or longer is acceptable if it reads well.

Bad:

```html
<meta name="description" content="We provide high quality services for everyone. Contact us today.">
```

Good:

```html
<meta name="description" content="Get professional accounting support in Armenia: tax reporting, payroll, bookkeeping, and business documentation for local companies.">
```

---

## 5. Heading Hierarchy

Every page must have a clean heading structure.

Rules:

- Use exactly one visible `<h1>` per page.
- The H1 must describe the main topic of the page.
- Use `<h2>` for major sections.
- Use `<h3>` for subsections under H2.
- Do not skip heading levels for visual reasons.
- Do not use headings only to make text bigger.
- Do not create multiple H1 headings inside sections unless the page architecture explicitly requires it and it is technically justified.

Good structure:

```html
<h1>Fulfillment Services for Online Stores</h1>

<section>
  <h2>What We Handle</h2>
  <h3>Storage</h3>
  <h3>Picking and Packing</h3>
  <h3>Delivery Preparation</h3>
</section>

<section>
  <h2>How the Process Works</h2>
</section>

<section>
  <h2>Frequently Asked Questions</h2>
</section>
```

Avoid:

```html
<h1>Services</h1>
<h1>Why Choose Us</h1>
<h4>Process</h4>
<h2>Small detail</h2>
```

---

## 6. Semantic HTML

Use semantic HTML to make the page easier to understand.

Prefer:

```html
<header></header>
<nav></nav>
<main></main>
<section></section>
<article></article>
<aside></aside>
<footer></footer>
```

Rules:

- Main page content must be inside `<main>`.
- Navigation links should be inside `<nav>`.
- Repeating page-level footer content should be inside `<footer>`.
- Blog posts or news items should use `<article>` where appropriate.
- Do not replace everything with generic `<div>` if semantic tags make sense.
- Buttons should be `<button>` when they trigger actions and `<a>` when they navigate.

---

## 7. Content Quality Rules

SEO content must be useful, specific, and written for people.

For each important page, check whether the content answers:

- What is being offered?
- Who is it for?
- What problem does it solve?
- What is included?
- How does the process work?
- What are the conditions, limitations, or requirements?
- Why should the user trust this company?
- What should the user do next?

Avoid:

- Empty marketing claims.
- Repeated keywords.
- Generic filler text.
- Very thin pages with no useful detail.
- Text that sounds like it was written only for search engines.
- Fake guarantees.
- Fake urgency.
- Fake reviews/testimonials.

Good SEO content is clear, specific, structured, and helpful.

---

## 8. Internal Links

Use internal links to help users and crawlers understand the site structure.

Rules:

- Link related pages to each other.
- Use descriptive anchor text.
- Avoid “click here”, “read more” without context, and vague anchors.
- Do not overdo internal links in every paragraph.
- Important service pages should be reachable from navigation, footer, service lists, or related content blocks.
- Breadcrumbs are recommended for deep page structures.

Bad:

```html
<a href="/services">Click here</a>
```

Good:

```html
<a href="/services/accounting">Accounting services for companies</a>
```

---

## 9. Images and Alt Attributes

All images must be handled intentionally.

Rules:

- Important content images need descriptive `alt`.
- Decorative images should use empty `alt=""`.
- Do not stuff keywords into alt text.
- File names should be meaningful when possible.
- Use lazy loading for below-the-fold images.
- Avoid huge unoptimized images.
- Set width and height where possible to reduce layout shift.

Good:

```html
<img src="/images/warehouse-packing-process.webp" alt="Warehouse worker packing an online store order" loading="lazy" width="800" height="600">
```

Decorative:

```html
<img src="/images/abstract-shape.svg" alt="" aria-hidden="true">
```

Avoid:

```html
<img src="/images/img123.jpg" alt="best warehouse fulfillment logistics storage packing shipping cheap service">
```

---

## 10. Canonical URL Rules

Use canonical URLs when there is duplicate or very similar content.

Rules:

- Every important indexable page should have a self-referencing canonical when the project supports it.
- Similar or duplicate pages should point to the preferred version.
- Do not canonical all pages to the home page.
- Do not add canonical tags randomly.
- Make sure canonical URLs are absolute and correct for production domain.
- Check that canonical does not point to staging, localhost, temporary domains, or wrong language versions.

Example:

```html
<link rel="canonical" href="https://example.com/services/accounting/">
```

---

## 11. Robots Meta Rules

Use robots meta only when there is a clear reason.

Allowed examples:

```html
<meta name="robots" content="index,follow">
<meta name="robots" content="noindex,follow">
<meta name="robots" content="noindex,nofollow">
```

Rules:

- Do not add `noindex` to important pages.
- Use `noindex` for pages that should not appear in search results: internal search results, duplicate landing variants, test pages, thank-you pages, admin-like pages, thin temporary pages.
- Do not rely on robots.txt to remove a page from search results.
- If a page must be removed from index, use `noindex` and ensure crawlers can access the page to see the tag.

---

## 12. Open Graph and Social Preview

Important pages should have social preview metadata.

Recommended tags:

```html
<meta property="og:title" content="Page title">
<meta property="og:description" content="Page description">
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/page/">
<meta property="og:image" content="https://example.com/images/og-image.jpg">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://example.com/images/og-image.jpg">
```

Rules:

- OG title should usually match or closely support the SEO title.
- OG description should be human-readable and compelling.
- OG image must be production-ready, not a placeholder.
- Do not point OG images to local files, staging URLs, or missing images.

---

## 13. Schema.org JSON-LD

Add structured data only when it matches visible page content.

Preferred format: JSON-LD.

Common schema types:

- `Organization`
- `LocalBusiness`
- `WebSite`
- `BreadcrumbList`
- `Service`
- `FAQPage`
- `Article`
- `Product`
- `Offer`
- `ContactPoint`

Rules:

- Do not add fake reviews or fake ratings.
- Do not add FAQPage schema if the FAQ is not visible on the page.
- Do not add Product schema if there is no real product.
- Do not add LocalBusiness schema if business details are missing or uncertain.
- Do not invent prices, addresses, phone numbers, author names, dates, or reviews.
- Keep schema consistent with visible content.
- Use absolute URLs.
- Keep JSON valid.

Example FAQPage schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does fulfillment cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fulfillment costs depend on storage volume, order quantity, packing requirements, and delivery method."
      }
    }
  ]
}
</script>
```

Example BreadcrumbList schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://example.com/services/"
    }
  ]
}
</script>
```

---

## 14. Multilingual SEO

If the site has multiple languages, check language structure.

Rules:

- Use correct `lang` attribute on the `<html>` tag.
- Use hreflang when there are equivalent pages in different languages.
- Do not canonical all language versions to one language.
- Each language version needs its own title and meta description.
- URLs should clearly separate languages if the project uses multilingual routing.
- Do not mix languages in meta tags unless intentionally required.

Example:

```html
<html lang="en">
```

Example hreflang:

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/services/">
<link rel="alternate" hreflang="ru" href="https://example.com/ru/services/">
<link rel="alternate" hreflang="hy" href="https://example.com/hy/services/">
<link rel="alternate" hreflang="x-default" href="https://example.com/services/">
```

---

## 15. URL Rules

URLs should be clean, readable, and stable.

Rules:

- Use lowercase URLs.
- Use hyphens instead of underscores.
- Avoid unnecessary dates unless needed.
- Avoid random IDs where readable slugs are possible.
- Avoid changing existing URLs unless redirects are also handled.
- Keep URLs short but descriptive.

Good:

```txt
/services/accounting/
```

Bad:

```txt
/page?id=123&cat=7
/services/Best_Accounting_Service_Armenia_2026_FINAL/
```

---

## 16. Sitemap and Robots.txt

When editing project-level SEO files:

### sitemap.xml

- Include important canonical indexable pages.
- Exclude noindex pages.
- Exclude staging/test/admin pages.
- Use correct production URLs.
- Update lastmod only if the project uses it accurately.

### robots.txt

- Do not block important pages, CSS, JS, or images needed for rendering.
- Do not use robots.txt as the main method for removing pages from search results.
- Reference sitemap if appropriate.

Example:

```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

---

## 17. Performance and Technical SEO

Watch for technical issues that affect SEO.

Check for:

- Huge unoptimized images.
- Missing width/height on images.
- Render-blocking scripts when avoidable.
- Layout shifts caused by images, fonts, or injected content.
- Broken internal links.
- Broken image paths.
- Duplicate IDs.
- Invalid HTML nesting.
- Missing viewport meta tag.
- Inaccessible buttons/links.
- Content hidden in a way that search engines or users cannot access.
- Important text rendered only as an image.

Required viewport tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 18. Accessibility That Supports SEO

Basic accessibility improves structure and clarity.

Rules:

- Use real text, not text embedded in images.
- Use descriptive link text.
- Use labels for forms.
- Keep heading hierarchy logical.
- Use alt attributes correctly.
- Ensure interactive elements are keyboard-accessible.
- Avoid empty buttons and links.
- Do not remove focus states.

---

## 19. Local SEO

For local business pages, check:

- Business name.
- Address, if public.
- Phone number.
- Email or contact method.
- Working hours, if relevant.
- Service area, if relevant.
- Embedded map, if used.
- LocalBusiness schema, if accurate.
- Consistent NAP data: name, address, phone.

Do not invent local business details.

---

## 20. Service Page SEO

For service pages, include useful sections when appropriate:

- Clear hero with service name and value.
- Who the service is for.
- What is included.
- Benefits.
- Process/steps.
- Required documents or conditions.
- Pricing or pricing logic if available.
- FAQ.
- CTA.
- Related services.
- Trust signals: experience, certifications, partners, case studies, real testimonials if available.

Do not create fake trust signals.

---

## 21. Blog Article SEO

For blog articles, check:

- Clear article H1.
- Intro that states the topic quickly.
- Logical H2/H3 structure.
- Author/date if the project uses them.
- Article schema if appropriate.
- Internal links to related pages.
- Descriptive title and meta description.
- Useful conclusion or next action.
- No duplicate article title/meta.

---

## 22. FAQ SEO

FAQ content must be real and useful.

Rules:

- Questions should be written like users actually ask them.
- Answers should be direct and specific.
- Avoid vague answers.
- Avoid adding too many weak questions.
- Use FAQPage schema only when FAQ is visible on the page.
- Do not use FAQ schema for promotional fake Q&A.

---

## 23. E-commerce/Product SEO

For product or category pages, check:

- Product/category name in H1.
- Unique product/category description.
- Clear price or request-price logic if relevant.
- Availability if relevant.
- Product images with alt.
- Product schema only if real product data exists.
- Category intro text if useful.
- Internal links to related products/categories.
- Avoid duplicate manufacturer descriptions without added value.

---

## 24. Common Anti-patterns to Fix

Actively detect and fix:

1. Missing title.
2. Duplicate title.
3. Missing meta description.
4. Multiple H1 headings.
5. No H1.
6. Random heading order.
7. Non-semantic HTML everywhere.
8. Important images without alt.
9. Decorative images with keyword-stuffed alt.
10. Broken internal links.
11. Links with vague anchor text.
12. Missing canonical on important pages.
13. Canonical pointing to wrong domain.
14. Noindex on important pages.
15. OG image pointing to missing/staging/local file.
16. Schema that does not match visible content.
17. Fake reviews or fake ratings.
18. Huge unoptimized images.
19. Important text only inside images.
20. Thin content with no useful detail.
21. Keyword-stuffed paragraphs.
22. Multiple pages targeting the same exact topic without differentiation.
23. Staging URLs in production metadata.
24. Missing lang attribute.
25. Wrong hreflang/canonical relationship.
26. Sitemap includes non-indexable pages.
27. robots.txt blocks important assets.
28. Generic CTA text repeated everywhere without context.

---

## 25. When Editing Existing Pages

Do not rewrite everything from scratch unless requested.

Prefer this order:

1. Fix metadata.
2. Fix heading hierarchy.
3. Fix semantic structure.
4. Fix internal links.
5. Fix image alt and loading attributes.
6. Add or correct canonical/robots tags.
7. Add Open Graph tags.
8. Add schema only when appropriate.
9. Improve thin or unclear content.
10. Check technical risks.

Preserve existing design and layout unless SEO requires structural correction.

---

## 26. When Creating New Pages

Before coding, internally answer:

1. What is the page type?
2. What is the primary user intent?
3. What should the H1 be?
4. What should the title tag be?
5. What should the meta description be?
6. What sections are required?
7. What internal links should exist?
8. What images need alt?
9. Is schema needed?
10. Should the page be indexable?
11. Is a canonical URL needed?
12. Are multilingual tags needed?

Then create the page.

---

## 27. Output Requirements

When finishing the task, provide a brief SEO summary:

1. Page type identified.
2. Main SEO changes made.
3. Metadata added or updated.
4. Heading/semantic structure changes.
5. Image/link/schema changes.
6. Indexation/canonical status.
7. Remaining risks or items that require real business data.

Do not only say “done”.

---

## Final SEO Review Checklist

Before final answer, verify:

- Page has one clear H1.
- Title is unique and specific.
- Meta description is unique and useful.
- Heading hierarchy is logical.
- Main content is inside semantic structure.
- Important images have useful alt.
- Decorative images have empty alt.
- Internal links use descriptive anchor text.
- Canonical is correct if present.
- No important page has accidental noindex.
- Open Graph tags are present for important pages.
- Schema is valid and matches visible content.
- URLs are clean and production-ready.
- Multilingual tags are correct if used.
- Sitemap/robots are not blocking important content.
- No fake reviews, fake ratings, or misleading schema.
- No keyword stuffing.
- No staging, localhost, or temporary URLs remain in production metadata.
