# Maintenance Page Final Format

Use this reference when implementing the EXPOForce-style maintenance page with a temporary preview bypass.

## Required Outcome

- Public visitors see the branded maintenance page.
- The main maintenance content is visible immediately.
- `Admin access` is a secondary button in the top/right controls.
- Clicking it opens a right-side drawer.
- Successful login sets a cookie readable by Apache and redirects into the real site.
- Apache bypasses maintenance mode only when that cookie is present.

This is a preview bypass, not real authentication.

## Apache Gate

```apache
RewriteEngine On

RewriteCond %{DOCUMENT_ROOT}/maintenance.enable -f
RewriteCond %{HTTP_COOKIE} !(^|;\s*)expaforceMaintenanceAuthorized=72a100f863e29954b6c05a7f1a48a12c7c497701333f87af89447113f52e3d26($|;) [NC]
RewriteCond %{REQUEST_URI} !^/maintenance\.html$ [NC]
RewriteCond %{REQUEST_URI} !^/src/ [NC]
RewriteCond %{REQUEST_URI} !^/scripts/ [NC]
RewriteCond %{REQUEST_URI} !^/scripts-js-php/ [NC]
RewriteCond %{REQUEST_URI} !^/partials/ [NC]
RewriteCond %{REQUEST_URI} !^/favicon\.ico$ [NC]
RewriteCond %{REQUEST_URI} !^/faicon\.ico$ [NC]
RewriteCond %{REQUEST_URI} !^/\.well-known/ [NC]
RewriteRule ^ - [R=503,L]

ErrorDocument 503 /maintenance.html

<IfModule mod_headers.c>
    Header always set Retry-After "3600" "expr=%{REQUEST_STATUS} == 503"
    Header always set Cache-Control "no-store, max-age=0" "expr=%{REQUEST_STATUS} == 503"
</IfModule>
```

Keep only allowlist entries the page actually needs, but include all CSS, JS, translation, favicon, and media paths used by `maintenance.html`.

## HTML Shape

Use the existing section/container/component system. This is the canonical structure:

```html
<body class="page page--maintenance">
  <main class="page-content">
    <section class="section section--maintenance maintenance" aria-labelledby="maintenance-title">
      <div class="container">
        <div class="section__inner maintenance__inner">
          <div class="maintenance__top">
            <a class="maintenance__brand" href="/index.html" data-i18n="[aria-label]header-brand-aria">
              <img class="maintenance__logo" src="/src/graphics/png/logo-rast.png" alt="EXPOForce" data-i18n="[alt]header-logo-alt">
            </a>

            <div class="maintenance__controls">
              <button
                class="button button--secondary button--small maintenance__admin-button"
                type="button"
                data-maintenance-auth-open
                aria-controls="maintenance-auth-panel"
                aria-expanded="false"
                data-i18n="[text]maintenance-auth-open"
              >
                Admin access
              </button>

              <div class="header__lang maintenance__lang" data-i18n="[aria-label]header-lang-aria">
                <button type="button" class="header__lang-button" data-set-lang="ru">RU</button>
                <button type="button" class="header__lang-button" data-set-lang="en">EN</button>
              </div>
            </div>
          </div>

          <div class="maintenance__auth-backdrop" data-maintenance-auth-backdrop hidden></div>

          <aside
            class="maintenance__auth-drawer"
            id="maintenance-auth-panel"
            data-maintenance-auth-drawer
            aria-hidden="true"
            aria-labelledby="maintenance-auth-title"
          >
            <div class="card maintenance__auth" data-maintenance-auth>
              <div class="maintenance__auth-header">
                <div class="maintenance__auth-heading">
                  <p class="maintenance__card-label" data-i18n="[text]maintenance-auth-label">Admin access</p>
                  <h2 class="maintenance__auth-title" id="maintenance-auth-title" data-i18n="[text]maintenance-auth-title">Maintenance page login</h2>
                </div>
                <button
                  class="maintenance__auth-close"
                  type="button"
                  data-maintenance-auth-close
                  aria-label="Close admin panel"
                  data-i18n="[aria-label]maintenance-auth-close-aria"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <p class="maintenance__auth-text" data-i18n="[text]maintenance-auth-text">
                Enter the admin credentials to open the site during maintenance.
              </p>

              <form class="maintenance__auth-form" data-maintenance-auth-form novalidate>
                <div class="form-field">
                  <label class="form-label" for="maintenance-login" data-i18n="[text]maintenance-auth-login-label">Login</label>
                  <input class="form-input" id="maintenance-login" name="login" type="text" autocomplete="username" required placeholder="admin" data-i18n="[placeholder]maintenance-auth-login-placeholder">
                </div>

                <div class="form-field">
                  <label class="form-label" for="maintenance-password" data-i18n="[text]maintenance-auth-password-label">Password</label>
                  <input class="form-input" id="maintenance-password" name="password" type="password" autocomplete="current-password" required placeholder="Password" data-i18n="[placeholder]maintenance-auth-password-placeholder">
                </div>

                <p class="maintenance__auth-error" data-maintenance-auth-error data-i18n="[text]maintenance-auth-error" aria-live="polite" hidden>
                  Invalid login or password.
                </p>

                <button class="button button--primary button--full" type="submit" data-i18n="[text]maintenance-auth-submit">Log in</button>
              </form>
            </div>
          </aside>

          <div class="maintenance__layout">
            <!-- Visible maintenance copy and contact/status cards. Do not add hidden here. -->
          </div>

          <p class="maintenance__end" data-i18n="[text]maintenance-end"></p>
        </div>
      </div>
    </section>
  </main>

  <script src="/scripts/translation.js"></script>
  <script src="/scripts/maintenance-auth.js?v=YYYYMMDD-1"></script>
</body>
```

## Auth Script Contract

Create or update `/scripts/maintenance-auth.js`. Use the existing project implementation if present. The minimum behavior is:

```js
(() => {
  const AUTH_STORAGE_KEY = "expaforceMaintenanceAuthorized";
  const AUTH_COOKIE_NAME = "expaforceMaintenanceAuthorized";
  const AUTH_COOKIE_MAX_AGE = 86400;
  const AUTH_HASH = "72a100f863e29954b6c05a7f1a48a12c7c497701333f87af89447113f52e3d26";

  function getAuthElements() {
    return {
      body: document.body,
      form: document.querySelector("[data-maintenance-auth-form]"),
      drawer: document.querySelector("[data-maintenance-auth-drawer]"),
      backdrop: document.querySelector("[data-maintenance-auth-backdrop]"),
      openButton: document.querySelector("[data-maintenance-auth-open]"),
      closeButton: document.querySelector("[data-maintenance-auth-close]"),
      error: document.querySelector("[data-maintenance-auth-error]"),
      login: document.querySelector("#maintenance-login"),
      password: document.querySelector("#maintenance-password"),
    };
  }

  async function hashCredentials(login, password) {
    const value = `${login}:${password}`;

    if (window.crypto && window.crypto.subtle && typeof TextEncoder !== "undefined") {
      try {
        const payload = new TextEncoder().encode(value);
        const digest = await window.crypto.subtle.digest("SHA-256", payload);
        return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
      } catch (error) {
        console.warn("[maintenance-auth] Web Crypto failed, use fallback hash.", error);
      }
    }

    // Include a SHA-256 fallback or use the existing project helper.
    return sha256Fallback(value);
  }

  function setAuthCookie() {
    const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(AUTH_HASH)}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax${secureFlag}`;
  }

  function getRedirectTarget() {
    const path = window.location.pathname || "/";
    if (path === "/maintenance.html" || path.endsWith("/maintenance.html")) return "/index.html";
    return `${path}${window.location.search || ""}${window.location.hash || ""}`;
  }

  function openDrawer(elements) {
    elements.body.classList.add("is-auth-drawer-open");
    elements.drawer?.setAttribute("aria-hidden", "false");
    elements.openButton?.setAttribute("aria-expanded", "true");
    if (elements.backdrop) elements.backdrop.hidden = false;
    window.setTimeout(() => elements.login?.focus(), 180);
  }

  function closeDrawer(elements) {
    elements.body.classList.remove("is-auth-drawer-open");
    elements.drawer?.setAttribute("aria-hidden", "true");
    elements.openButton?.setAttribute("aria-expanded", "false");
    if (elements.backdrop) elements.backdrop.hidden = true;
  }

  function init() {
    const elements = getAuthElements();
    if (!elements.form || !elements.drawer || !elements.openButton) return;

    closeDrawer(elements);

    elements.openButton.addEventListener("click", () => openDrawer(elements));
    elements.closeButton?.addEventListener("click", () => closeDrawer(elements));
    elements.backdrop?.addEventListener("click", () => closeDrawer(elements));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDrawer(elements);
    });

    elements.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (elements.error) elements.error.hidden = true;

      const formData = new FormData(elements.form);
      const login = String(formData.get("login") || "").trim();
      const password = String(formData.get("password") || "");

      if ((await hashCredentials(login, password)) === AUTH_HASH) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        setAuthCookie();
        window.location.assign(getRedirectTarget());
        return;
      }

      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      if (elements.error) elements.error.hidden = false;
      elements.password?.focus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
```

Important: the snippet references `sha256Fallback(value)`. Either include the full fallback helper from the existing project implementation or use another deterministic SHA-256 fallback. Do not leave correct credentials dependent only on `crypto.subtle`.

## SCSS Shape

Use the project tokens. The drawer must be fixed to the right and opened by a body class:

```scss
.maintenance__auth-backdrop {
  position: fixed;
  inset: 0;
  z-index: $z-menu-backdrop;
  background-color: rgba($surface-color-dark, 0.36);
  backdrop-filter: blur(3px);
}

.maintenance__auth-backdrop[hidden] {
  display: none;
}

.maintenance__auth-drawer {
  position: fixed;
  inset-block: 0;
  inset-inline-end: 0;
  z-index: $z-modal;
  display: grid;
  width: min(100%, 440px);
  padding: var(--space-4);
  pointer-events: none;
  transform: translateX(100%);
  visibility: hidden;
  transition: transform $transition-base, visibility $transition-base;
}

.page--maintenance.is-auth-drawer-open .maintenance__auth-drawer {
  pointer-events: auto;
  transform: translateX(0);
  visibility: visible;
}
```

Add project-consistent styles for `.maintenance__controls`, `.maintenance__auth`, `.maintenance__auth-header`, `.maintenance__auth-close`, `.maintenance__auth-form`, and `.maintenance__auth-error`. Reuse `.button`, `.card`, `.form-field`, and `.form-input`.

## Translation Keys

Use these key names in every supported language:

```json
"maintenance-auth-label": "Admin access",
"maintenance-auth-title": "Maintenance page login",
"maintenance-auth-text": "Enter the admin credentials to open the site during maintenance.",
"maintenance-auth-open": "Admin access",
"maintenance-auth-close-aria": "Close admin access panel",
"maintenance-auth-login-label": "Login",
"maintenance-auth-login-placeholder": "admin",
"maintenance-auth-password-label": "Password",
"maintenance-auth-password-placeholder": "Password",
"maintenance-auth-error": "Invalid login or password.",
"maintenance-auth-submit": "Log in"
```

## Validation Focus

- `maintenance__layout` is not hidden.
- `Admin access` opens a right-side drawer.
- Wrong credentials show error and no redirect.
- `admin` / `bababiboba` sets the cookie and redirects to the site.
- `.htaccess` allows requests when that cookie is present.
- Script URL has a cache-busting query after auth script changes.
