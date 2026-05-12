(() => {
    const SCROLL_THRESHOLD = 420;

    function initBacker(root = document) {
        const scope = root && typeof root.querySelector === "function" ? root : document;
        const backer = scope.querySelector("[data-backer]") || document.querySelector("[data-backer]");

        if (!backer || backer.dataset.backerReady === "true") {
            return;
        }

        backer.dataset.backerReady = "true";

        let isVisible = false;
        let isTicking = false;

        function setVisibility(nextVisibility) {
            if (nextVisibility === isVisible) {
                return;
            }

            isVisible = nextVisibility;
            backer.classList.toggle("is-visible", isVisible);
            backer.setAttribute("aria-hidden", isVisible ? "false" : "true");
            backer.tabIndex = isVisible ? 0 : -1;
        }

        function updateVisibility() {
            setVisibility(window.scrollY > SCROLL_THRESHOLD);
            isTicking = false;
        }

        function requestVisibilityUpdate() {
            if (isTicking) {
                return;
            }

            isTicking = true;
            window.requestAnimationFrame(updateVisibility);
        }

        backer.addEventListener("click", () => {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });
        });

        window.addEventListener("scroll", requestVisibilityUpdate, { passive: true });
        updateVisibility();
    }

    document.addEventListener("partial:loaded", (event) => {
        initBacker(event.detail?.node || document);
    });

    document.addEventListener("partials:loaded", () => {
        initBacker();
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => initBacker());
    } else {
        initBacker();
    }
})();
