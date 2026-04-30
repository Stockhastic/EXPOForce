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
