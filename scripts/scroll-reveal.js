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
