---
name: backer-implementation
description: Use this skill when adding a fixed "back to top" button to pages that require smooth scroll navigation. Apply it to long-form pages, multi-section layouts, and mobile-friendly designs that need quick navigation to the top.
---

# Backer Implementation Skill

Use this skill to implement a professional "back to top" button that improves UX on long pages without cluttering the design.

## Scope

Use this skill for:
- long pages with multiple sections (> 4 sections or > 2 viewport heights)
- pages where users scroll significantly down
- improving mobile UX on content-heavy pages
- adding smooth scroll-to-top functionality
- fixed floating UI that doesn't distract from main content

Do not use this skill for:
- short pages (single viewport height)
- heavy animation or parallax effects
- sticky navigation that should remain visible throughout
- modal or overlay components
- pages already using smooth scroll navigation in header

## Core principles

### Visibility and restraint
- Button appears only after user scrolls down (e.g., after 300-500px)
- Button does not appear on first page load or while near the top
- Button fades in/out smoothly to avoid jarring appearance
- Button is visually subtle but clearly clickable

### Positioning and size
- Fixed position: bottom-right corner
- Spacing from edges: 16-24px (use spacing tokens `--space-4` or `--space-5`)
- Button size: 48-56px (touch-friendly, minimum 44×44px)
- Do not obstruct important page content (CTA, forms, final sections)
- Adjust positioning on mobile if needed (may move slightly up or adjust size)

### Behavior
- Click behavior: smooth scroll to top (not instant jump)
- Scroll duration: 300-500ms
- Scroll easing: ease-in-out for smooth, natural feel
- Button should not interfere with page interactions
- Button should be accessible via keyboard (Tab key)

### Accessibility
- Button has clear `aria-label` (e.g., "Back to top" or "Go to top")
- Button is keyboard accessible (Tab, Enter/Space to activate)
- Button should be announced by screen readers
- Consider `title` attribute for hover tooltip
- Ensure sufficient color contrast with background

### Styling
- Use existing design tokens for colors, spacing, shadows
- Match project's premium but practical aesthetic
- Use transparent or subtle background (not bright/distracting)
- Subtle hover/focus states
- Icon should be simple and clear (chevron up, arrow up)
- Do not use animated decorative effects (keep it functional)

## Implementation checklist

- [ ] Create HTML button element with semantic structure
- [ ] Add scroll event listener to detect scroll position
- [ ] Show/hide button based on scroll threshold (e.g., > 500px)
- [ ] Implement smooth scroll-to-top function using `window.scrollTo({ top: 0, behavior: 'smooth' })`
- [ ] Style button with fixed positioning and appropriate spacing
- [ ] Add hover and focus states
- [ ] Test on desktop, tablet, mobile
- [ ] Verify keyboard accessibility (Tab, Enter)
- [ ] Verify screen reader announces button correctly
- [ ] Ensure button does not overlap critical page elements
- [ ] Test touch responsiveness on mobile
- [ ] Add transition/fade effects for appearing/disappearing
- [ ] Respect `prefers-reduced-motion` media query (reduce animation if needed)

## CSS considerations

Use spacing tokens only:
```scss
.backer {
  position: fixed;
  bottom: var(--space-5);
  right: var(--space-5);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
  
  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
  
  &:hover {
    // subtle hover state
  }
  
  &:focus {
    // visible focus outline
  }
}
```

## JavaScript considerations

- Throttle scroll event to prevent excessive function calls
- Use `requestAnimationFrame` for smooth scroll animation if needed
- Store button visibility state to avoid redundant DOM updates
- Clean up event listeners if button is conditionally rendered

## Mobile considerations

- Ensure button does not cover important footer CTAs
- Consider reducing size slightly on very small screens (< 375px)
- Ensure 48×48px minimum touch target
- Test with iOS and Android browsers
- Verify button is accessible from bottom of page (footer area)
