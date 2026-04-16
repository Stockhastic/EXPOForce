const partialIds = ["header", "footer"];
const partialNodes = partialIds.map(id => document.getElementById(id)).filter(Boolean);

function renderPartialError(node, partialPath, reason) {
    node.innerHTML = `<div class="partial-error">${reason}: ${partialPath}</div>`;
}

async function loadPartial(node) {
    const partialId = node.id;

    if (!partialId) {
        return;
    }

    const partialPath = `/partials/${partialId}.html`;
    const response = await fetch(partialPath);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    node.innerHTML = await response.text();
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
