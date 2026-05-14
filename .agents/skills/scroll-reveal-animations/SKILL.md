---
name: scroll-reveal-animations
description: Use this skill when implementing scroll-triggered reveal animations for page elements. Apply it to hero sections, card grids, service blocks, metrics, testimonials, and any multi-element compositions where staggered entrance timing improves visual impact and user engagement.
---

# Scroll Reveal Animations Skill

## Purpose

Implement professional scroll-triggered animations that reveal page elements as users scroll through the viewport. Elements enter with directional fades (up, down, left, right) based on their position within the section, creating a cohesive, purposeful visual experience without distraction.

---

## Scope

### Use this skill for:
- Hero sections with multiple content blocks
- Card grids and asymmetric card layouts
- Service or feature blocks with mixed content
- Testimonial sections
- Metrics and stats displays
- Multi-element sections where staggered timing enhances narrative flow
- Long-form pages where progressive reveal improves scanning
- Any section with 3+ elements that benefit from sequenced entrance

### Do not use this skill for:
- Single-element sections or minimal content
- Pages that prioritize instant load and immediate scanning
- Sections already using animation libraries (Animate.css, GSAP, etc.)
- Mobile-only experiences where scroll reveal may feel sluggish
- Accessibility-critical contexts where motion might distract from meaning
- Sections where animation adds decoration rather than clarity

---

## Core Principles

### 1. Direction-based animation selection
- **fade-up**: Element is positioned **below** the section center (bottom-aligned) — exits bottom, enters from bottom with upward motion and opacity fade
- **fade-down**: Element is positioned **above** the section center (top-aligned) — exits top, enters from top with downward motion and opacity fade
- **fade-left**: Element is positioned **right** of section center (right-aligned) — exits right, enters from right with leftward motion and opacity fade
- **fade-right**: Element is positioned **left** of section center (left-aligned) — exits left, enters from left with rightward motion and opacity fade

### 2. Animation timing and motion
- All animations use **IntersectionObserver** (not scroll events for performance)
- Animation triggers when element enters viewport (approximately 80% visibility threshold)
- Animations respect user's `prefers-reduced-motion` setting
- Motion feels natural: ease-in-out timing, moderate offset (typically 24–40px)
- Animation duration is consistent across all elements (uses `--reveal-duration` token)

### 3. Layout intelligence
- Element's vertical and horizontal position within its parent section determines animation type
- Animations should feel purposeful, not arbitrary
- Grid-based sections use position logic: top-left → fade-right, bottom-right → fade-up, etc.
- Asymmetric layouts follow the visual weight anchor (largest card typically uses its actual position)

### 4. Performance and accessibility
- Uses **IntersectionObserver** with passive event listeners (no jank)
- Lazy-initializes only when needed (checks `prefers-reduced-motion`)
- No layout thrashing; offsets handled entirely through CSS transforms
- Screen readers ignore animation metadata; content hierarchy is unchanged

---

## Animation Types

### fade-up
```
Initial state: transform: translateY(40px); opacity: 0;
Final state:   transform: translateY(0); opacity: 1;
Trigger:       Element bottom positioned in section
Use case:      Footer text, bottom-aligned cards, closing CTA
```

### fade-down
```
Initial state: transform: translateY(-40px); opacity: 0;
Final state:   transform: translateY(0); opacity: 1;
Trigger:       Element top positioned in section
Use case:      Hero text, top-aligned cards, section headers
```

### fade-left
```
Initial state: transform: translateX(40px); opacity: 0;
Final state:   transform: translateX(0); opacity: 1;
Trigger:       Element right positioned in section
Use case:      Right-column content, right-aligned cards, secondary visuals
```

### fade-right
```
Initial state: transform: translateX(-40px); opacity: 0;
Final state:   transform: translateX(0); opacity: 1;
Trigger:       Element left positioned in section
Use case:      Left-column content, left-aligned cards, primary visuals
```

---

## SCSS Implementation

### 1. Add animation variables to `_vars.scss`

In your `src/scss/base/_vars.scss`, add these tokens in the Motion section:
```scss
// Motion
$transition-base: 0.2s ease;
$reveal-duration: 0.6s;
$reveal-offset: 40px;
$reveal-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
$reveal-delay-base: 50ms;
```

### 2. Create `_scroll-reveal.scss` in `src/scss/components/`

New file: `src/scss/components/_scroll-reveal.scss`

```scss
// ============================================================================
// Scroll Reveal Animations
// ============================================================================
// Direction-based fade animations triggered on viewport intersection
// Uses IntersectionObserver for performance

// ---- Base State (Before Reveal) ----
[data-reveal] {
  opacity: 0;
  transform: translateY(0) translateX(0);
  transition: opacity $reveal-duration $reveal-easing,
              transform $reveal-duration $reveal-easing;
  
  // Respect prefers-reduced-motion
  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

// ---- Individual Animation Types ----
[data-reveal="fade-up"] {
  transform: translateY($reveal-offset);
}

[data-reveal="fade-down"] {
  transform: translateY(-$reveal-offset);
}

[data-reveal="fade-left"] {
  transform: translateX($reveal-offset);
}

[data-reveal="fade-right"] {
  transform: translateX(-$reveal-offset);
}

// ---- Active State (Animation Triggered) ----
[data-reveal].reveal-active {
  opacity: 1;
  transform: translateY(0) translateX(0);
}

// ---- Stagger effect (sequential animations) ----
[data-reveal] {
  @for $i from 1 through 20 {
    &[data-reveal-index="#{$i}"] {
      transition-delay: $reveal-delay-base * ($i - 1);
    }
  }
}

// ---- Ensure motion respects user preference ----
@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    animation: none;
    transition: none;
    opacity: 1;
    transform: none !important;
  }
}
```

### 3. Update `src/scss/components/index.scss`

Add this import to the end of the file:
```scss
@import '_scroll-reveal';
```

---

## JavaScript Implementation

Create new file: `src/js/scroll-reveal.js`

```javascript
/**
 * Scroll Reveal Animations
 * Triggers directional fade animations when elements enter viewport
 * Uses IntersectionObserver for performance
 */

class ScrollRevealAnimations {
  constructor(options = {}) {
    this.options = {
      rootMargin: '0px 0px -100px 0px', // Trigger when 80% visible
      threshold: 0,
      enableStagger: true,
      onceOnly: true, // Remove animation class after trigger (optional)
      ...options
    };

    this.observer = null;
    this.initialized = false;
  }

  /**
   * Initialize the observer
   */
  init() {
    if (this.initialized) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Skip initialization if user prefers reduced motion
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          if (this.options.onceOnly) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, this.options);

    this.setupRevealElements();
    this.initialized = true;
  }

  /**
   * Find all elements with data-reveal attribute
   * Auto-detect animation type if not explicitly set
   */
  setupRevealElements() {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((el, index) => {
      // If data-reveal is empty or "auto", detect animation type
      if (!el.getAttribute('data-reveal') || el.getAttribute('data-reveal') === 'auto') {
        const animationType = this.detectAnimationType(el);
        el.setAttribute('data-reveal', animationType);
      }

      // Set stagger index for sequential animations
      if (this.options.enableStagger) {
        el.setAttribute('data-reveal-index', index + 1);
      }

      // Start observing
      this.observer.observe(el);
    });
  }

  /**
   * Detect animation type based on element position within parent section
   * Returns: 'fade-up', 'fade-down', 'fade-left', 'fade-right'
   */
  detectAnimationType(element) {
    const section = element.closest('[class*="section"]');
    if (!section) return 'fade-up'; // Default fallback

    const sectionRect = section.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Calculate relative position within section
    const verticalCenter = sectionRect.top + sectionRect.height / 2;
    const horizontalCenter = sectionRect.left + sectionRect.width / 2;

    const elementVerticalCenter = elementRect.top + elementRect.height / 2;
    const elementHorizontalCenter = elementRect.left + elementRect.width / 2;

    // Determine primary position
    const isTopHalf = elementVerticalCenter < verticalCenter;
    const isLeftHalf = elementHorizontalCenter < horizontalCenter;
    const isRightHalf = elementHorizontalCenter > horizontalCenter;
    const isBottomHalf = elementVerticalCenter > verticalCenter;

    // Priority: vertical position takes precedence for text-heavy sections
    // horizontal for card grids
    const sectionHasMoreVerticalContent = sectionRect.height > sectionRect.width * 0.6;

    if (sectionHasMoreVerticalContent) {
      // Text-heavy section: prioritize vertical
      if (isBottomHalf) return 'fade-up';
      if (isTopHalf) return 'fade-down';
      if (isRightHalf) return 'fade-left';
      if (isLeftHalf) return 'fade-right';
    } else {
      // Card grid: prioritize horizontal
      if (isRightHalf) return 'fade-left';
      if (isLeftHalf) return 'fade-right';
      if (isBottomHalf) return 'fade-up';
      if (isTopHalf) return 'fade-down';
    }

    return 'fade-up'; // Ultimate fallback
  }

  /**
   * Destroy observer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
      this.initialized = false;
    }
  }

  /**
   * Refresh — re-scan DOM for new reveal elements
   */
  refresh() {
    if (!this.initialized) return;
    this.setupRevealElements();
  }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.scrollReveal = new ScrollRevealAnimations();
  window.scrollReveal.init();
});

// Also initialize on load (for images, fonts, etc.)
window.addEventListener('load', () => {
  if (window.scrollReveal) {
    window.scrollReveal.refresh();
  }
});

export default ScrollRevealAnimations;
```

---

## Selection Strategy: How to Choose Animation Type

### Automatic Detection (Recommended)
Use `data-reveal="auto"` or just `data-reveal`. The JavaScript automatically detects element position and assigns the appropriate animation.

```html
<div data-reveal>Content here</div>
```

### Manual Selection
Explicitly set animation type when auto-detection might be wrong:

```html
<!-- Bottom-aligned card: fade-up -->
<article class="card" data-reveal="fade-up">...</article>

<!-- Top-aligned heading: fade-down -->
<h2 data-reveal="fade-down">Section Title</h2>

<!-- Right column content: fade-left -->
<div class="content-right" data-reveal="fade-left">...</div>

<!-- Left column content: fade-right -->
<div class="content-left" data-reveal="fade-right">...</div>
```

### Decision Logic by Element Type

| Element Type | Typical Position | Animation | Reason |
|---|---|---|---|
| Hero headline | Top of section | `fade-down` | Emphasizes entry from top |
| Hero subtext | Below headline | `fade-up` | Natural reading order |
| Hero CTA | Bottom of hero | `fade-up` | Draws eye downward |
| Section heading | Top of section | `fade-down` | Leads into content |
| Left column text | Left side | `fade-right` | Enters from left edge |
| Right column cards | Right side | `fade-left` | Enters from right edge |
| Card grid (uniform) | Center/mixed | `auto` | Let script decide per card |
| Bottom CTA block | Bottom of page | `fade-up` | Final upward push |
| Metrics row (middle) | Center | `auto` or `fade-up` | Natural entrance |
| Footer content | Bottom | `fade-up` | Consistent with layout |

---

## HTML Implementation Examples

### Example 1: Hero Section
```html
<section class="section section--hero">
  <div class="container">
    <div class="hero__inner">
      <h1 data-reveal="fade-down">Premium Fulfillment Solutions</h1>
      <p data-reveal="fade-up">Scale your operations with enterprise-grade logistics infrastructure.</p>
      <button class="button button--primary" data-reveal="fade-up">Get Started</button>
    </div>
  </div>
</section>
```

### Example 2: Service Cards Section (Right-aligned)
```html
<section class="section section--services">
  <div class="container">
    <div class="services__layout">
      <div class="services__content">
        <h2 data-reveal="fade-down">Our Services</h2>
        <p data-reveal="fade-up">Industry-leading fulfillment and warehousing.</p>
      </div>
      
      <div class="services__cards">
        <article class="card" data-reveal><!-- auto-detect: fade-left --></article>
        <article class="card" data-reveal><!-- auto-detect: fade-left --></article>
        <article class="card" data-reveal><!-- auto-detect: fade-left --></article>
      </div>
    </div>
  </div>
</section>
```

### Example 3: Metrics Grid
```html
<section class="section section--metrics">
  <div class="container">
    <div class="metrics__grid">
      <div class="metric-card" data-reveal><!-- auto: likely fade-up --></div>
      <div class="metric-card" data-reveal><!-- auto: likely fade-up --></div>
      <div class="metric-card" data-reveal><!-- auto: likely fade-up --></div>
    </div>
  </div>
</section>
```

### Example 4: Left-Right Split
```html
<section class="section section--content">
  <div class="container">
    <div class="content-layout">
      <div class="content-left" data-reveal="fade-right">
        <h2>Building Better Logistics</h2>
        <p>Long-form explanation paragraph about our approach...</p>
      </div>
      
      <div class="content-right" data-reveal="fade-left">
        <img src="..." alt="..." />
      </div>
    </div>
  </div>
</section>
```

---

## Implementation Checklist

- [ ] Add animation variables to `src/scss/base/_vars.scss`
- [ ] Create `src/scss/components/_scroll-reveal.scss`
- [ ] Add import to `src/scss/components/index.scss`
- [ ] Create `src/js/scroll-reveal.js`
- [ ] Include script in page HTML before closing `</body>` tag
- [ ] Add `data-reveal` attributes to target elements
- [ ] Test auto-detection on various page layouts
- [ ] Test manual animation selection for edge cases
- [ ] Verify `prefers-reduced-motion` disables animations
- [ ] Check performance with DevTools (0 layout shifts)
- [ ] Test on desktop, tablet, mobile viewports
- [ ] Verify stagger delays create visual rhythm
- [ ] Test with slow and fast scrolling
- [ ] Ensure animations don't interfere with other functionality
- [ ] Validate keyboard navigation and screen reader behavior
- [ ] Add examples to `uikit.html`

---

## Integration with Project Structure

### 1. Update `src/scss/base/_vars.scss`
Add animation tokens in the Motion section.

### 2. Create component file
Place `_scroll-reveal.scss` in `src/scss/components/`.

### 3. Update imports
Add `@import '_scroll-reveal'` to `src/scss/components/index.scss`.

### 4. Add JavaScript
Place `scroll-reveal.js` in `src/js/` directory.

### 5. Include in HTML
Add before closing `</body>`:
```html
<script src="src/js/scroll-reveal.js"></script>
```

Or if using modules, import in main `script.js`:
```javascript
import ScrollRevealAnimations from './scroll-reveal.js';
```

### 6. Markup application
Add `data-reveal` attributes to elements that should animate.

---

## Performance Considerations

### IntersectionObserver vs Scroll Events
- **IntersectionObserver**: No jank, browser-optimized, fires once per element entry
- **Scroll Events**: Legacy, causes layout thrashing, fires 60+ times per second

This implementation uses **IntersectionObserver** exclusively.

### Motion respects accessibility
- Animations disabled when `prefers-reduced-motion: reduce` is set
- Content remains fully accessible without animation
- No semantic changes; only visual presentation changes

### Transform-based motion
- Uses `transform: translateX/Y()` (GPU-accelerated, performant)
- Does not use `left`, `top`, `margin` (causes layout recalculation)
- Single `transition` property for both opacity and transform

---

## Testing & Validation

### Desktop Test
- Scroll through page slowly — watch animations trigger smoothly
- Check DevTools Performance tab — no dropped frames
- Verify stagger timing creates visual rhythm

### Mobile Test
- Test on real device
- Verify animations don't feel sluggish
- Check smooth scroll performance

### Accessibility Test
- Enable `prefers-reduced-motion: reduce` in OS settings
- Verify animations are completely disabled
- Check all content visible without animation

### Edge Cases
- Dynamic content (call `scrollReveal.refresh()`)
- Lazy-loaded images (refresh after image load)
- Single-element sections (should work fine)

---

## Common Patterns

### Staggered Card Grid
```html
<div class="card-grid">
  <div class="card" data-reveal><!-- index 1, no delay --></div>
  <div class="card" data-reveal><!-- index 2, 50ms delay --></div>
  <div class="card" data-reveal><!-- index 3, 100ms delay --></div>
</div>
```

Stagger is automatic; just add `data-reveal` to each element.

### Disable Stagger for Specific Elements
```scss
.card.special {
  transition-delay: 0 !important;
}
```

### Disable Animation for Specific Elements
```html
<div class="card" data-reveal="none">This won't animate</div>
```

Or remove `data-reveal` entirely.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Animations not triggering | Verify script is loaded. Check DevTools console. Ensure `data-reveal` attribute exists. |
| Animations feel slow | Reduce `$reveal-duration` (try 0.4s–0.5s). Lower rootMargin threshold. |
| Animations stutter on mobile | Check other heavy animations/JS. Profile with DevTools. Reduce page complexity. |
| Stagger timing is off | Verify `$reveal-delay-base` value. Check `data-reveal-index` values are sequential. |
| Elements animate twice | Ensure `onceOnly: true` in options (default). |
| Elements not detected | Check parent has `section` class or element is within a section. |

---

## Related Skills

- **design-consistency**: Ensure animations don't break visual balance or introduce inconsistent animation styles.
- **design-identity**: Verify animation timing and direction align with brand aesthetic.
- **section-visual-balance**: Use together for asymmetric layouts; animations should emphasize intended visual flow.
- **performance**: Monitor impact on Core Web Vitals; animations should not increase LCP or CLS.

---

## Done When

A scroll reveal implementation is successful only if:
- ✓ All target elements have appropriate `data-reveal` attributes
- ✓ Animations trigger smoothly as elements enter viewport
- ✓ Animation timing feels natural (0.5–0.8s range)
- ✓ Stagger creates rhythmic visual flow (50–100ms between elements)
- ✓ Auto-detection correctly identifies element positions
- ✓ Animations respect `prefers-reduced-motion` setting
- ✓ No layout shifts or performance degradation
- ✓ Desktop, tablet, mobile viewports feel smooth
- ✓ Animations enhance readability, not distract
- ✓ Keyboard navigation and screen readers unaffected
- ✓ All animations tested with slow and fast scrolling

A scroll reveal section is not done if:
- [ ] Animations feel jerky or stuttering
- [ ] Elements animate inconsistently (some don't trigger)
- [ ] Timing feels arbitrary or disrupts reading flow
- [ ] Accessibility features are broken or hidden
- [ ] Performance impact is visible in DevTools
- [ ] Mobile experience feels unresponsive
