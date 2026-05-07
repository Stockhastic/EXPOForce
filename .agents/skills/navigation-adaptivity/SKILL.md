---
name: navigation-adaptivity
description: Use this skill when implementing responsive navigation that adapts from desktop horizontal menus to mobile burger menus. Apply it to header navigation, mobile menu behavior, menu toggle buttons, accessibility standards, and motion design for navigation patterns.
---

# Navigation Adaptivity Skill

Read `AGENTS.md` first, especially the motion, responsiveness, and layout rules.

This skill defines how to implement professional, modern burger menu systems that follow design system rules and accessibility standards.

## Scope

Use this skill for:
- responsive header navigation
- burger menu (hamburger) toggle implementation
- mobile navigation patterns
- menu animation and transitions
- accessibility (ARIA, keyboard navigation, focus management)
- menu state management
- touch-friendly tap targets

Do not use this skill for:
- mega menus or dropdown complexity
- flyout submenus
- scroll behavior management
- animations unrelated to navigation
- form interactions inside menus
- complex menu filtering or search

## Core principles

### Desktop first, mobile respectful
- Desktop: full horizontal navigation
- Tablet: evaluate based on space; may keep horizontal or switch to burger
- Mobile: always burger menu with appropriate density
- Do not force burger menu on desktop if horizontal nav fits

### Spacious and touch-friendly
- Minimum tap target: 44 × 44 px (iOS) / 48 × 48 dp (Material Design)
- Menu items: generous padding to prevent mis-taps
- Avoid cramped mobile navigation
- Use white space inside menu items deliberately

### Accessibility first
- Burger button must have clear `aria-label`
- Menu must use proper semantic HTML (`<nav>`, `<ul>`, `<li>`)
- Keyboard navigation: Tab, Enter, Escape to close
- Focus management: trap focus inside open menu, return to button on close
- Screen reader: announce menu state changes
- Use `aria-expanded` on button
- Use `aria-hidden` on decorative elements

### Smooth but subtle motion
- Transitions: 200-300ms for menu animations
- Use CSS transitions, not JavaScript animations
- Prefer slide/fade over dramatic effects
- Motion should not distract from content
- Respect `prefers-reduced-motion` media query

### No layout hacks
- Use CSS Grid or Flexbox for menu layout
- Never use absolute positioning to place nav items
- Never use negative margins to shift menu
- Never use `transform: translate(...)` for layout alignment
- Use `max-width` and `container` system for menu width
- Use `gap` for spacing between menu items

## HTML structure

### Desktop navigation

```html
<header class="header">
  <div class="header__inner">
    <div class="header__brand">
      <!-- Logo -->
    </div>

    <nav class="header__nav" aria-label="Main navigation">
      <ul class="nav__list">
        <li class="nav__item">
          <a href="#" class="nav__link">Services</a>
        </li>
        <li class="nav__item">
          <a href="#" class="nav__link">About</a>
        </li>
        <li class="nav__item">
          <a href="#" class="nav__link">Contact</a>
        </li>
      </ul>
    </nav>

    <div class="header__controls">
      <button class="header__lang-toggle">EN</button>
      <button class="header__menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <span class="menu-toggle__icon"></span>
      </button>
    </div>
  </div>

  <!-- Mobile-only menu backdrop and drawer -->
  <div class="header__menu-backdrop" aria-hidden="true"></div>
  <div class="header__menu-drawer" role="navigation" aria-label="Mobile navigation">
    <ul class="mobile-menu__list">
      <li class="mobile-menu__item">
        <a href="#" class="mobile-menu__link">Services</a>
      </li>
      <li class="mobile-menu__item">
        <a href="#" class="mobile-menu__link">About</a>
      </li>
      <li class="mobile-menu__item">
        <a href="#" class="mobile-menu__link">Contact</a>
      </li>
    </ul>
  </div>
</header>
```

### Key structure rules

- Use semantic `<nav>`, `<ul>`, `<li>` for menu lists
- Keep burger button inside `.header__controls` alongside language switcher
- Create separate mobile-only drawer element (visible only on mobile via CSS)
- Use `.header__menu-backdrop` for click-to-close overlay
- Menu drawer should be a direct child of header for z-index and scroll stacking
- Do not nest `.header__menu-drawer` inside `.header__inner`

## SCSS structure

### Burger button styles

```scss
.header__menu-toggle {
  display: none; // Hidden on desktop
  width: 48px;
  height: 48px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: $z-menu-toggle;

  &:focus-visible {
    outline: 2px solid $focus-color;
    outline-offset: 2px;
  }
}

.menu-toggle__icon {
  display: block;
  width: 24px;
  height: 20px;
  position: relative;
  transition: transform 300ms $ease-cubic;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: $text-color;
    transition: all 300ms $ease-cubic;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
}

// When menu is open, animate burger to X
.header__menu-toggle[aria-expanded='true'] .menu-toggle__icon {
  &::before {
    transform: rotate(45deg) translateY(9px);
  }

  &::after {
    transform: rotate(-45deg) translateY(-9px);
  }
}
```

**Important:**
- Burger button width/height must be ≥ 44px
- Icon itself should be 20-24px (visual size is smaller than tap target)
- Use `transition` on pseudo-elements for smooth animation
- Change `aria-expanded` via JavaScript
- Never use `transform` to move nav items into place — only for burger icon animation

### Mobile menu drawer

```scss
.header__menu-drawer {
  display: none; // Hidden on desktop
  position: fixed;
  top: $header-height; // Position below header
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $white;
  z-index: $z-menu-drawer;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 300ms $ease-cubic;
  box-shadow: 0 2px 8px rgba($black, 0.1);

  &.is-open {
    transform: translateX(0);
  }
}

.header__menu-backdrop {
  display: none; // Hidden on desktop
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($black, 0.5);
  z-index: $z-menu-backdrop;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms $ease-cubic;

  &.is-open {
    opacity: 1;
    pointer-events: auto;
  }
}
```

### Mobile menu items

```scss
.mobile-menu__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0; // Items have full-width borders
}

.mobile-menu__item {
  border-bottom: 1px solid $border-color;

  &:first-child {
    border-top: 1px solid $border-color;
  }
}

.mobile-menu__link {
  display: block;
  padding: var(--space-5) var(--space-4);
  color: $text-color;
  text-decoration: none;
  font-weight: $fw-medium;
  transition: background-color 200ms $ease-cubic, color 200ms $ease-cubic;

  &:hover {
    background-color: $background-hover;
  }

  &:focus-visible {
    outline: 2px solid $focus-color;
    outline-offset: -2px; // Inset outline for mobile
  }

  &:active {
    background-color: $background-active;
  }
}
```

### Responsive breakpoint

```scss
@media (max-width: $bp-tablet) {
  .header__menu-toggle {
    display: flex;
  }

  .header__menu-drawer,
  .header__menu-backdrop {
    display: block;
  }

  // Hide desktop nav on tablet/mobile
  .header__nav {
    display: none;
  }
}
```

**Do not:**
- Use `display: none` on individual menu items (use parent wrapper)
- Hardcode menu width or height
- Use absolute positioning inside mobile menu
- Create fake separators with margins
- Use hardcoded `top` values — always calculate from `$header-height`

## JavaScript implementation

### Minimal state management

```javascript
const menuToggle = document.querySelector('.header__menu-toggle');
const menuDrawer = document.querySelector('.header__menu-drawer');
const menuBackdrop = document.querySelector('.header__menu-backdrop');
const menuLinks = document.querySelectorAll('.mobile-menu__link');

// State
let isMenuOpen = false;

// Toggle menu
function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  menuToggle.setAttribute('aria-expanded', isMenuOpen);
  menuDrawer.classList.toggle('is-open', isMenuOpen);
  menuBackdrop.classList.toggle('is-open', isMenuOpen);

  // Prevent scroll when menu is open
  document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

// Close menu when clicking backdrop
menuBackdrop.addEventListener('click', () => {
  if (isMenuOpen) toggleMenu();
});

// Close menu when clicking a link
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (isMenuOpen) toggleMenu();
  });
});

// Close menu on Escape key
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && isMenuOpen) {
    toggleMenu();
    menuToggle.focus(); // Return focus to button
  }
});

// Toggle button click
menuToggle.addEventListener('click', toggleMenu);
```

### Rules

- Keep JS minimal — CSS handles animation
- Use CSS `transition` for menu slide/fade
- Use JavaScript only for state (`aria-expanded`, classes)
- Never animate with `setInterval` or `requestAnimationFrame` for simple slide
- Always return focus to toggle button when menu closes via Escape
- Prevent body scroll when menu is open
- Close menu when a link is clicked

## Accessibility checklist

- [ ] Burger button has `aria-label="Toggle navigation menu"`
- [ ] Button has `aria-expanded="true/false"` that updates with state
- [ ] Menu drawer has `role="navigation"` and `aria-label="Mobile navigation"`
- [ ] Menu backdrop has `aria-hidden="true"`
- [ ] All menu links are keyboard accessible (Tab navigation)
- [ ] Focus visible on all interactive elements (2px outline, 2px offset)
- [ ] Escape key closes menu
- [ ] Menu links have `:focus-visible` styling
- [ ] No focus trap without way to exit
- [ ] Menu respects `prefers-reduced-motion`

### Example with prefers-reduced-motion

```scss
@media (prefers-reduced-motion: reduce) {
  .header__menu-drawer,
  .header__menu-backdrop,
  .menu-toggle__icon {
    transition: none;
  }
}
```

## Motion rules

Based on `AGENTS.md`:

- Menu slide: 300ms smooth ease (not bouncy)
- Burger icon: 300ms smooth rotation
- Backdrop fade: 300ms opacity change
- No dramatic parallax or scroll effects
- No animation should feel jerky or unnatural
- Always respect `prefers-reduced-motion`

Allowed animations:
- Slide-in from left for drawer
- Fade for backdrop
- Rotate for burger lines
- Smooth color transitions on hover

Avoid:
- Elastic or bouncy easing
- Scale transforms
- Flip or 3D rotations
- Long delays
- Staggered animations

## Related skills

Use this skill together with other project skills:

- `design-consistency` — to keep burger menu styling aligned with header and section patterns
- `seo-optimization` — ensure nav links are properly marked for crawlers
- `translation-system` — if menu items are multilingual, keep `data-i18n` attributes consistent
- `design-identity` — for visual tone and button styling that matches brand

## Testing checklist

- [ ] Desktop: menu hidden, burger hidden, full nav visible
- [ ] Tablet: evaluate space; switch to burger if needed
- [ ] Mobile: burger visible, full nav hidden, drawer slides in smoothly
- [ ] Burger icon animates to X when menu opens
- [ ] Clicking backdrop closes menu
- [ ] Clicking menu link closes menu
- [ ] Escape key closes menu
- [ ] Focus trapped inside menu (Tab cycles through links)
- [ ] Focus returns to button when closed via Escape
- [ ] Body scroll prevented when menu open
- [ ] Touch-friendly: menu items are ≥ 44px tall
- [ ] Keyboard navigation works without mouse
- [ ] Screen reader announces menu state
- [ ] Animation respects `prefers-reduced-motion`
- [ ] Works on iOS Safari, Android Chrome, Firefox, Chrome

## Common mistakes

❌ **Don't:**
- Use `position: absolute` to place menu over content
- Create menu with `transform: translate(400px)` where 400px is guessed width
- Hardcode burger button size
- Skip `aria-expanded` and keyboard handling
- Use `display: none` on menu items instead of parent drawer
- Animate with JavaScript intervals
- Forget focus management
- Ignore touch targets (< 44px)
- Use background image for burger icon (use CSS shapes or SVG)

✅ **Do:**
- Use `position: fixed` for overlay menu
- Use CSS transitions for smooth animation
- Base menu width on viewport
- Implement full accessibility from start
- Keep menu semantically simple
- Respect `prefers-reduced-motion`
- Test on real mobile devices
- Make tap targets comfortable (48+ px)
- Use semantic HTML and ARIA properly

## Z-index layering

Define these in `_vars.scss`:

```scss
$z-header: 100;
$z-menu-backdrop: 101;
$z-menu-drawer: 102;
$z-menu-toggle: 103;
```

Reasoning:
- Header sits above page content
- Backdrop sits on top of header
- Drawer sits on top of backdrop
- Toggle button sits on top of everything to be clickable

## Performance

- Use CSS `transition` for animation (GPU-accelerated)
- Avoid repaints during menu animation
- Use `will-change: transform` sparingly (only on drawer)
- Do not animate `width`, `height`, or `top` — use `transform` or pre-calculated positions
- Lazy-load menu content only if necessary

---

**This skill works best when combined with design consistency, proper HTML semantics, and keyboard accessibility from the start.**
