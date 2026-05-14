# Scroll Reveal Animations - Quick Start Guide

## Files Created
- ✅ `SKILL.md` — Full skill documentation
- ✅ `src/scss/components/_scroll-reveal.scss` — Animation styles
- ✅ `src/js/scroll-reveal.js` — IntersectionObserver logic
- ✅ Updated `src/scss/base/_vars.scss` — Added animation tokens
- ✅ Updated `src/scss/components/index.scss` — Added import
- ✅ Updated `uikit.html` — Added examples

## How to Use

### 1. Add `data-reveal` attribute to HTML elements

```html
<!-- Auto-detect animation based on element position -->
<div data-reveal>Content here</div>

<!-- Or manually specify animation type -->
<h2 data-reveal="fade-down">Section Title</h2>
<div data-reveal="fade-left">Right column content</div>
```

### 2. Animation Types

| Attribute | Use When |
|-----------|----------|
| `data-reveal="fade-up"` | Element is bottom-aligned in section |
| `data-reveal="fade-down"` | Element is top-aligned in section |
| `data-reveal="fade-left"` | Element is right-aligned in section |
| `data-reveal="fade-right"` | Element is left-aligned in section |
| `data-reveal` | Auto-detect based on position |

### 3. Customize Animation Speed

Edit `src/scss/base/_vars.scss`:

```scss
// Motion
$reveal-duration: 0.6s;      // Change animation duration (default: 0.6s)
$reveal-offset: 40px;        // Change movement distance (default: 40px)
$reveal-delay-base: 50ms;    // Change stagger delay (default: 50ms)
```

### 4. Test It

- Open `uikit.html` in browser
- Scroll down to see scroll reveal examples
- All animations should trigger as elements enter viewport

## Key Features

✓ 4 directional animations (up, down, left, right)  
✓ Automatic position detection  
✓ Smooth, GPU-accelerated transforms  
✓ Respects `prefers-reduced-motion` accessibility setting  
✓ Zero jank - uses IntersectionObserver  
✓ Optional staggered timing between elements  
✓ Works on mobile, tablet, desktop  

## Integration Checklist

- [x] SCSS component created and imported
- [x] JavaScript module created and included in uikit.html
- [x] Animation variables added to _vars.scss
- [x] Examples added to uikit.html
- [ ] Add `data-reveal` attributes to your page sections
- [ ] Test on different screen sizes
- [ ] Adjust animation duration if needed
- [ ] Verify accessibility: disable animations in OS settings and check they're gone

## Troubleshooting

**Animations not triggering?**
- Check browser console for errors
- Verify `scroll-reveal.js` is loaded before `</body>`
- Ensure `data-reveal` attribute exists on element

**Animations feel too slow/fast?**
- Adjust `$reveal-duration` in _vars.scss
- Rebuild CSS with new values

**Element animates wrong direction?**
- Use explicit `data-reveal="fade-left"` instead of `auto`
- Or ensure element is in expected position within section

See `SKILL.md` for complete documentation and advanced usage.
