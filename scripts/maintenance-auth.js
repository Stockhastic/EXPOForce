(() => {
    const AUTH_STORAGE_KEY = "expaforceMaintenanceAuthorized";
    const AUTH_HASH = "72a100f863e29954b6c05a7f1a48a12c7c497701333f87af89447113f52e3d26";
    const AUTH_COOKIE_NAME = "expaforceMaintenanceAuthorized";
    const AUTH_COOKIE_MAX_AGE = 86400;

    function getAuthElements() {
        return {
            body: document.body,
            form: document.querySelector("[data-maintenance-auth-form]"),
            authPanel: document.querySelector("[data-maintenance-auth]"),
            drawer: document.querySelector("[data-maintenance-auth-drawer]"),
            backdrop: document.querySelector("[data-maintenance-auth-backdrop]"),
            openButton: document.querySelector("[data-maintenance-auth-open]"),
            closeButton: document.querySelector("[data-maintenance-auth-close]"),
            error: document.querySelector("[data-maintenance-auth-error]"),
            login: document.querySelector("#maintenance-login"),
            password: document.querySelector("#maintenance-password"),
        };
    }

    function toHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    function stringToBytes(value) {
        if (typeof TextEncoder !== "undefined") {
            return Array.from(new TextEncoder().encode(value));
        }

        const bytes = [];

        for (let index = 0; index < value.length; index += 1) {
            let code = value.charCodeAt(index);

            if (code < 0x80) {
                bytes.push(code);
                continue;
            }

            if (code < 0x800) {
                bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
                continue;
            }

            if (code >= 0xd800 && code <= 0xdbff && index + 1 < value.length) {
                const next = value.charCodeAt(index + 1);

                if (next >= 0xdc00 && next <= 0xdfff) {
                    code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
                    bytes.push(
                        0xf0 | (code >> 18),
                        0x80 | ((code >> 12) & 0x3f),
                        0x80 | ((code >> 6) & 0x3f),
                        0x80 | (code & 0x3f)
                    );
                    index += 1;
                    continue;
                }
            }

            bytes.push(
                0xe0 | (code >> 12),
                0x80 | ((code >> 6) & 0x3f),
                0x80 | (code & 0x3f)
            );
        }

        return bytes;
    }

    function rotateRight(value, bits) {
        return (value >>> bits) | (value << (32 - bits));
    }

    function sha256Fallback(value) {
        const constants = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
            0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
            0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
            0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
            0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
            0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
        ];
        const hash = [
            0x6a09e667,
            0xbb67ae85,
            0x3c6ef372,
            0xa54ff53a,
            0x510e527f,
            0x9b05688c,
            0x1f83d9ab,
            0x5be0cd19,
        ];
        const bytes = stringToBytes(value);
        const bitLength = bytes.length * 8;
        const words = new Array(64);

        bytes.push(0x80);

        while (bytes.length % 64 !== 56) {
            bytes.push(0);
        }

        const highBits = Math.floor(bitLength / 0x100000000);
        const lowBits = bitLength >>> 0;

        for (let shift = 24; shift >= 0; shift -= 8) {
            bytes.push((highBits >>> shift) & 0xff);
        }

        for (let shift = 24; shift >= 0; shift -= 8) {
            bytes.push((lowBits >>> shift) & 0xff);
        }

        for (let chunk = 0; chunk < bytes.length; chunk += 64) {
            for (let index = 0; index < 16; index += 1) {
                const offset = chunk + index * 4;
                words[index] =
                    ((bytes[offset] << 24) |
                        (bytes[offset + 1] << 16) |
                        (bytes[offset + 2] << 8) |
                        bytes[offset + 3]) >>>
                    0;
            }

            for (let index = 16; index < 64; index += 1) {
                const s0 =
                    rotateRight(words[index - 15], 7) ^
                    rotateRight(words[index - 15], 18) ^
                    (words[index - 15] >>> 3);
                const s1 =
                    rotateRight(words[index - 2], 17) ^
                    rotateRight(words[index - 2], 19) ^
                    (words[index - 2] >>> 10);

                words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
            }

            let a = hash[0];
            let b = hash[1];
            let c = hash[2];
            let d = hash[3];
            let e = hash[4];
            let f = hash[5];
            let g = hash[6];
            let h = hash[7];

            for (let index = 0; index < 64; index += 1) {
                const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
                const choice = (e & f) ^ (~e & g);
                const temp1 = (h + s1 + choice + constants[index] + words[index]) >>> 0;
                const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
                const majority = (a & b) ^ (a & c) ^ (b & c);
                const temp2 = (s0 + majority) >>> 0;

                h = g;
                g = f;
                f = e;
                e = (d + temp1) >>> 0;
                d = c;
                c = b;
                b = a;
                a = (temp1 + temp2) >>> 0;
            }

            hash[0] = (hash[0] + a) >>> 0;
            hash[1] = (hash[1] + b) >>> 0;
            hash[2] = (hash[2] + c) >>> 0;
            hash[3] = (hash[3] + d) >>> 0;
            hash[4] = (hash[4] + e) >>> 0;
            hash[5] = (hash[5] + f) >>> 0;
            hash[6] = (hash[6] + g) >>> 0;
            hash[7] = (hash[7] + h) >>> 0;
        }

        return hash.map((item) => item.toString(16).padStart(8, "0")).join("");
    }

    async function hashCredentials(login, password) {
        const value = `${login}:${password}`;

        if (window.crypto && window.crypto.subtle && typeof TextEncoder !== "undefined") {
            try {
                const encoder = new TextEncoder();
                const payload = encoder.encode(value);
                const digest = await window.crypto.subtle.digest("SHA-256", payload);

                return toHex(digest);
            } catch (error) {
                console.warn("[maintenance-auth] Web Crypto failed, using fallback hash.", error);
            }
        }

        return sha256Fallback(value);
    }

    function setError(elements, isVisible) {
        if (!elements.error) return;

        elements.error.hidden = !isVisible;
        elements.login?.setAttribute("aria-invalid", isVisible ? "true" : "false");
        elements.password?.setAttribute("aria-invalid", isVisible ? "true" : "false");
    }

    function getCookie(name) {
        const cookie = document.cookie
            .split(";")
            .map((item) => item.trim())
            .find((item) => item.startsWith(`${name}=`));

        return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
    }

    function hasAuthCookie() {
        return getCookie(AUTH_COOKIE_NAME) === AUTH_HASH;
    }

    function setAuthCookie() {
        const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";

        document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(AUTH_HASH)}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax${secureFlag}`;
    }

    function getRedirectTarget() {
        const currentPath = window.location.pathname || "/";
        const currentTarget = `${currentPath}${window.location.search || ""}${window.location.hash || ""}`;

        if (currentPath === "/maintenance.html" || currentPath.endsWith("/maintenance.html")) {
            return "/index.html";
        }

        return currentTarget;
    }

    function redirectToSite() {
        window.location.assign(getRedirectTarget());
    }

    function openDrawer(elements) {
        elements.body.classList.add("is-auth-drawer-open");
        elements.drawer?.setAttribute("aria-hidden", "false");
        elements.openButton?.setAttribute("aria-expanded", "true");

        if (elements.backdrop) {
            elements.backdrop.hidden = false;
        }

        window.setTimeout(() => {
            elements.login?.focus();
        }, 180);
    }

    function closeDrawer(elements) {
        elements.body.classList.remove("is-auth-drawer-open");
        elements.drawer?.setAttribute("aria-hidden", "true");
        elements.openButton?.setAttribute("aria-expanded", "false");

        if (elements.backdrop) {
            elements.backdrop.hidden = true;
        }

        setError(elements, false);
    }

    function init() {
        const elements = getAuthElements();

        if (!elements.form || !elements.drawer || !elements.openButton) return;

        if (hasAuthCookie() || sessionStorage.getItem(AUTH_STORAGE_KEY) === "true") {
            setAuthCookie();
            redirectToSite();
            return;
        }

        closeDrawer(elements);

        elements.openButton.addEventListener("click", () => openDrawer(elements));
        elements.closeButton?.addEventListener("click", () => closeDrawer(elements));
        elements.backdrop?.addEventListener("click", () => closeDrawer(elements));

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeDrawer(elements);
            }
        });

        elements.form.addEventListener("submit", async (event) => {
            event.preventDefault();
            setError(elements, false);

            const formData = new FormData(elements.form);
            const login = String(formData.get("login") || "").trim();
            const password = String(formData.get("password") || "");
            const hash = await hashCredentials(login, password);

            if (hash === AUTH_HASH) {
                sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
                setAuthCookie();
                redirectToSite();
                return;
            }

            sessionStorage.removeItem(AUTH_STORAGE_KEY);
            setError(elements, true);
            elements.password?.focus();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
