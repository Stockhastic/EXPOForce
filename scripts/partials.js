const partialIds = ["header", "footer"];
const partialNodes = partialIds.map(id => document.getElementById(id)).filter(Boolean);
const currentScriptUrl = document.currentScript
    ? new URL(document.currentScript.getAttribute("src"), window.location.href)
    : new URL("scripts/partials.js", window.location.href);
const siteRootUrl = new URL("../", currentScriptUrl);

function resolveSitePath(path) {
    return new URL(path.replace(/^\/+/, ""), siteRootUrl).toString();
}

function preparePartialHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    template.content.querySelectorAll("[href^='/'], [src^='/']").forEach((element) => {
        ["href", "src"].forEach((attribute) => {
            const value = element.getAttribute(attribute);

            if (value && value.startsWith("/")) {
                element.setAttribute(attribute, resolveSitePath(value));
            }
        });
    });

    return template.innerHTML;
}

function renderPartialError(node, partialPath, reason) {
    node.innerHTML = `<div class="partial-error">${reason}: ${partialPath}</div>`;
}

function initHeaderNavigation(root = document) {
    const header = root.querySelector ? root.querySelector(".header") : null;

    if (!header || header.dataset.navigationReady === "true") {
        return;
    }

    const menuToggle = header.querySelector(".header__menu-toggle");
    const menuDrawer = header.querySelector(".header__menu-drawer");
    const menuBackdrop = header.querySelector(".header__menu-backdrop");
    const menuLinks = header.querySelectorAll(".mobile-menu__link, .mobile-menu__cta");
    const focusableSelector = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    if (!menuToggle || !menuDrawer || !menuBackdrop) {
        return;
    }

    header.dataset.navigationReady = "true";

    function getFocusableElements() {
        return [...header.querySelectorAll(focusableSelector)].filter((element) => {
            const isRendered = element.getClientRects().length > 0;
            const isDrawerItem = menuDrawer.contains(element);
            const isVisibleHeaderControl = !menuDrawer.contains(element);

            return isRendered && (isDrawerItem || isVisibleHeaderControl);
        });
    }

    function setMenuState(isOpen, shouldRestoreFocus = false) {
        header.classList.toggle("is-menu-open", isOpen);
        menuDrawer.classList.toggle("is-open", isOpen);
        menuBackdrop.classList.toggle("is-open", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.classList.toggle("is-navigation-open", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";

        if (shouldRestoreFocus) {
            menuToggle.focus();
        }
    }

    function closeMenu(shouldRestoreFocus = false) {
        setMenuState(false, shouldRestoreFocus);
    }

    function toggleMenu() {
        const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
        setMenuState(isOpen);
    }

    menuToggle.addEventListener("click", toggleMenu);
    menuBackdrop.addEventListener("click", () => closeMenu(true));

    menuLinks.forEach((link) => {
        link.addEventListener("click", () => closeMenu(false));
    });

    document.addEventListener("keydown", (event) => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

        if (!isOpen) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeMenu(true);
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusableElements = getFocusableElements();

        if (!focusableElements.length) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
            return;
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 769px)").matches) {
            closeMenu(false);
        }
    });
}

async function loadPartial(node) {
    const partialId = node.id;

    if (!partialId) {
        return;
    }

    const partialPath = resolveSitePath(`partials/${partialId}.html`);
    const response = await fetch(partialPath);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    node.innerHTML = preparePartialHtml(await response.text());
    node.dataset.partialLoaded = "true";

    if (partialId === "header") {
        initHeaderNavigation(node);
    }
}

async function initPartials() {
    if (window.location.protocol === "file:") {
        partialNodes.forEach((node) => {
            renderPartialError(
                node,
                `partials/${node.id}.html`,
                "Use a local server to load partial"
            );
        });

        return;
    }

    await Promise.all(
        [...partialNodes].map(async (node) => {
            try {
                await loadPartial(node);
                document.dispatchEvent(
                    new CustomEvent('partial:loaded', { detail: { node } })
                );
            } catch (error) {
                console.error(error);
                renderPartialError(
                    node,
                    `partials/${node.id}.html`,
                    "Failed to load partial"
                );
            }
        })
    );

    document.dispatchEvent(new CustomEvent('partials:loaded'));
}

document.addEventListener("DOMContentLoaded", () => {
    void initPartials();
});
