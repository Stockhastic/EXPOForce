(() => {
    const SCROLL_THRESHOLD = 420;
    const BACKER_SELECTOR = "[data-backer]";

    function getBackerLabel() {
        const dictionary = window.SiteI18n?.getDictionary?.() || {};

        return dictionary["backer-label"] || (document.documentElement.lang === "en" ? "Back to top" : "\u041d\u0430\u0432\u0435\u0440\u0445");
    }

    function createBacker() {
        const backer = document.createElement("button");
        const label = getBackerLabel();

        backer.className = "backer";
        backer.type = "button";
        backer.dataset.backer = "";
        backer.dataset.backerGenerated = "true";
        backer.setAttribute("aria-label", label);
        backer.setAttribute("aria-hidden", "true");
        backer.setAttribute("tabindex", "-1");
        backer.setAttribute("title", label);
        backer.setAttribute("data-i18n", "[aria-label]backer-label;[title]backer-label");
        backer.innerHTML = `
            <svg class="backer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 5 5 12l1.4 1.4 4.6-4.6V20h2V8.8l4.6 4.6L19 12z"></path>
            </svg>
        `;

        document.body.append(backer);
        window.SiteI18n?.apply?.(backer);

        return backer;
    }

    function getBacker(root = document) {
        const scope = root && typeof root.querySelector === "function" ? root : document;
        const backers = [...document.querySelectorAll(BACKER_SELECTOR)];
        const persistentBacker = backers.find((backer) => backer.dataset.backerGenerated !== "true");

        if (persistentBacker) {
            backers
                .filter((backer) => backer !== persistentBacker && backer.dataset.backerGenerated === "true")
                .forEach((backer) => backer.remove());

            return persistentBacker;
        }

        return scope.querySelector(BACKER_SELECTOR) || backers[0] || null;
    }

    function initBacker(root = document, options = {}) {
        const backer = getBacker(root) || (options.createIfMissing && document.body ? createBacker() : null);

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

    function observeBacker() {
        if (!document.body || document.body.dataset.backerObserverReady === "true") {
            return;
        }

        document.body.dataset.backerObserverReady = "true";

        const observer = new MutationObserver(() => {
            initBacker();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    document.addEventListener("partial:loaded", (event) => {
        initBacker(event.detail?.node || document);
    });

    document.addEventListener("partials:loaded", () => {
        initBacker();
    });

    document.addEventListener("i18n:updated", () => {
        document.querySelectorAll(BACKER_SELECTOR).forEach((backer) => {
            const label = getBackerLabel();

            backer.setAttribute("aria-label", label);
            backer.setAttribute("title", label);
        });
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            observeBacker();
            initBacker();
        });
    } else {
        observeBacker();
        initBacker();
    }

    window.addEventListener("load", () => {
        initBacker(document, { createIfMissing: true });
    });
})();
