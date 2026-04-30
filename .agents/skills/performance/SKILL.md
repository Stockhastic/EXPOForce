---
name: performance
description: Use this skill when reviewing or improving website performance, loading speed, resource payload, render path, Core Web Vitals, images, fonts, CSS/JS delivery, and runtime efficiency.
---

# Performance Skill

## Goal

Make web pages faster and more efficient while preserving UX, accessibility, and design quality.

Performance improvements must be measurable and meaningful for real users, not just synthetic scores.

---

## Core Principle

Optimize the page system, not only individual assets.

Start with page purpose and architecture, then improve loading behavior, resource size, and runtime efficiency.

Do not trade accessibility, usability, or functional correctness for a small speed improvement.

---

## Related skills

Use this skill together with other project skills:

- `design-consistency` — to keep optimized CSS, layout, and section structure coherent with the existing design system.
- `seo-optimization` — because speed is part of SEO and page experience, especially on mobile.
- `translation-system` — to ensure lazy-loading, dynamic content, and language switching do not break performance or content visibility.
- `design-identity` — to ensure performance fixes do not alter the site’s premium, practical visual identity.
- `image-prompt-generator` — when image strategy must balance visual impact with performance.

---

## Required Workflow

When reviewing or improving a page, follow this process:

1. Identify the page type and its priority.
2. Measure current performance using real tools.
3. Identify the main performance bottlenecks.
4. Apply targeted optimization categories.
5. Validate the impact and document changes.

---

## 1. Identify page priority

Classify the page by its user role and performance importance:

- Home page / landing page
- Service page
- About / contact page
- FAQ page
- Content / blog page
- Utility or dashboard page

Pages with high acquisition value deserve stricter performance discipline.

---

## 2. Measure first

Use actual performance tools before making changes:

- Lighthouse or PageSpeed Insights
- DevTools Performance panel
- WebPageTest
- Real device / mobile network testing

Capture key metrics:

- Largest Contentful Paint (LCP)
- Interaction to Next Paint (INP) / First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Total Blocking Time (TBT)
- First Contentful Paint (FCP)
- Time to Interactive (TTI)

Do not optimize blind. Use data to target the most important issues.

---

## 3. Identify bottlenecks

Check these likely issues in priority order:

- large or unoptimized images
- render-blocking CSS and JS
- slow-loading web fonts
- excessive third-party scripts
- unused CSS or JS
- heavy main-thread work
- layout shifts from late content
- too many requests or large payloads

Always verify the actual impact of each issue on the page’s load path.

---

## 4. Optimization categories

### Assets

- Optimize and resize images for the page’s layout.
- Use modern formats where appropriate (WebP, AVIF) while keeping fallback support.
- Lazy-load noncritical images and media.
- Use responsive `srcset` / `sizes` for images.
- Compress and cache assets effectively.

### Fonts

- Preload key fonts when needed.
- Use `font-display: swap` or similar to avoid invisible text.
- Subset fonts only if the build supports it.
- Avoid loading too many font families or weights.

### CSS and HTML

- Keep CSS critical for first render and defer the rest.
- Remove unused or duplicate styles.
- Use a minimal set of layout rules for above-the-fold content.
- Prefer simple, semantic markup.

### JavaScript

- Defer or async noncritical scripts.
- Split bundles if the page loads extra code it does not need.
- Avoid large framework bundles for simple pages.
- Delay third-party widgets until interaction when possible.

### Delivery

- Use compression (gzip, Brotli) and caching headers.
- Preload crucial resources.
- Use HTTP/2 or HTTP/3 if available.
- Avoid unnecessary redirects.

### Runtime

- Use lazy loading for offscreen content.
- Use Intersection Observer instead of scroll polling.
- Avoid layout-triggering operations in animation loops.
- Keep DOM size reasonable.

---

## 5. Validate impact

After changes, re-measure the same metrics and compare:

- Did LCP improve?
- Did TBT/TTI decrease?
- Did CLS remain under 0.1?
- Did the total payload size shrink?
- Did real-device mobile performance improve?

If a change did not help or caused regressions, revert or adjust it.

---

## 6. Document and report

Record the optimization work clearly:

- what was changed
- which metric improved and by how much
- what remains risky or unoptimized

This keeps performance work practical and repeatable.

---

## Anti-patterns

Do not:

- optimize without measurement
- use arbitrary fixes that break accessibility
- inline huge CSS just to hide render-blocking
- load fonts or scripts before they are needed
- rely only on desktop testing
- treat performance as a one-time task instead of an ongoing process
