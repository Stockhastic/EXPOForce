---
name: maintenance-system
description: Implement a production-ready website maintenance mode from scratch, based on the Armbiz static-site pattern. Use when Codex is asked to add, recreate, repair, or document a maintenance/technical works/under construction system for a website, especially Apache or .htaccess based static sites that need a toggle file, HTTP 503 responses, a branded maintenance page, i18n text, static asset allowlists, and deployment-safe validation.
---

# Maintenance System

## Overview

Build maintenance mode as a server-side gate, not as a client-side redirect. The working pattern is: Apache returns HTTP 503 when a marker file exists, serves `maintenance.html` as the error document, and allowlists only the maintenance page plus assets/scripts required to render it.

## Core Contract

- Use a zero-byte marker file named `maintenance.enable` in the web root as the on/off switch.
- Do not rely on `maintenance.disable`; in the Armbiz pattern it is only a harmless file unless rewrite rules explicitly check it.
- Return `503 Service Unavailable` for blocked pages so search engines and monitors understand the outage is temporary.
- Serve `/maintenance.html` as `ErrorDocument 503`.
- Set `Retry-After`, usually `3600`, through `mod_headers` when available.
- Allow static paths needed by the maintenance page: `/src/`, `/scripts-js-php/`, `/partials/`, `/favicon.ico`, and `/.well-known/`.
- Keep the maintenance page independent enough to render when normal navigation, forms, or dynamic content are unavailable.

## Implementation Workflow

1. Inspect the stack and document root.
   - For Apache/static sites, edit root `.htaccess`.
   - For another server, implement the same semantics in that server: marker-controlled gate, 503 status, maintenance page, static asset allowlist, `Retry-After`.
2. Add or update the server gate before unrelated rewrite rules that could swallow the request.
3. Create `maintenance.html` at the web root.
4. Reuse the site's global CSS, fonts, favicon, cursor/page-fade elements, language switcher, and contact patterns when they exist.
5. Add i18n keys to the existing translation source if the site uses `data-i18n`.
6. Add scoped `.maintenance` styles in the source stylesheet; rebuild or update compiled CSS according to the repo's existing workflow.
7. Validate both disabled and enabled states before finishing.

## Apache Pattern

Use this `.htaccess` block as the default shape. Preserve existing canonical-host redirects above it when they must run before maintenance mode.

```apache
RewriteEngine On

# Toggle maintenance mode by creating/removing /maintenance.enable
RewriteCond %{DOCUMENT_ROOT}/maintenance.enable -f
RewriteCond %{REQUEST_URI} !^/maintenance\.html$ [NC]
RewriteCond %{REQUEST_URI} !^/src/ [NC]
RewriteCond %{REQUEST_URI} !^/scripts-js-php/ [NC]
RewriteCond %{REQUEST_URI} !^/partials/ [NC]
RewriteCond %{REQUEST_URI} !^/favicon\.ico$ [NC]
RewriteCond %{REQUEST_URI} !^/\.well-known/ [NC]
RewriteRule ^ - [R=503,L]

ErrorDocument 503 /maintenance.html

<IfModule mod_headers.c>
    Header always set Retry-After "3600"
</IfModule>
```

Adjust the allowlist if the maintenance page uses different asset directories, analytics scripts, CDN paths, or API endpoints. Keep the allowlist minimal.

## Maintenance Page

Use a standalone `maintenance.html` that follows the site's existing HTML conventions:

- Include the global stylesheet with absolute paths, for example `/src/css/styles.css`.
- Preload site fonts when other pages do.
- Include favicon links and manifest when the site already has them.
- Include `#cursor`, `#aura`, and `.page-fade` if the global script expects them.
- Add language buttons with `.header__lang-switcher-item` and `data-lang` so the existing language handler can work.
- Mark text nodes with `data-i18n` keys.
- Include direct emergency contact links in the page or a non-empty `#contact-us-short.contact` block. In Armbiz, `includes.js` only replaces this partial when it is empty, so inline contact content remains stable during maintenance.
- Load shared scripts at the end only if they are allowlisted and tolerate missing normal-page elements.
- Keep third-party analytics/widgets optional. Reuse them only if already present in the site and they do not block rendering.

Recommended page sections:

- background decoration: `.maintenance__bg-design`
- language switcher: `.maintenance__lang-switcher`
- centered logo: `.maintenance__logo`
- message block: `.maintenance__title`, `.maintenance__subtitle`
- contact block: emails, phones, addresses, messengers
- footer/legal line: `.maintenance__end`

## I18n Contract

When the project has a JSON dictionary and a generic `data-i18n` applier, add the same keys to every supported language:

```json
"maintenance-title": "Right now we are under <span class=\"special-text\">maintenance</span>",
"maintenance-subtitle1": "We are doing our best to complete the technical work as quickly as possible.",
"maintenance-subtitle2": "In case of emergency, contact us by messenger, email, or phone on weekdays from 10:00 to 18:00 Armenian time.",
"maintenance-address-title": "Our offices",
"maintenance-address-subtitle1": "Armenia, Yerevan, Arabkir, Vagharsh Vagharshyan 12/1",
"maintenance-address-subtitle2": "Russia, Moscow, Sibirski Proezd 2b2",
"maintenance-end-title": "&copy; 2026 Armbiz Consulting - Your success is Our mission"
```

If the dictionary is strict JSON, preserve commas and escaping. If the project stores non-ASCII text, keep the file's existing encoding and line endings.

## Styling Pattern

Scope styles under `.maintenance` and reuse existing variables/mixins. In the Armbiz SCSS structure, maintenance styles live in `src/scss/styles.scss` after the shared background animation styles.

```scss
.maintenance {
    &-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    &__logo {
        align-self: flex-start;
        margin-top: 2rem;
        width: 200px;
        display: flex;
        margin-inline: auto;
    }

    &__title,
    &__subtitle,
    &__end {
        text-align: center;
    }

    &__bg-design {
        position: absolute;
        z-index: -100;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }

    &__lang-switcher {
        right: 0;
        position: absolute;
        display: flex;
        justify-content: center;
    }
}
```

Also include responsive adjustments through the project's existing mixins. After editing SCSS, run the repo's build command if one exists. If the repo commits compiled CSS and has no build tooling, update compiled CSS only in the style expected by that repo.

## Validation

Always test the behavior, not just file presence.

- With no `maintenance.enable`, normal pages should load normally.
- After creating `maintenance.enable`, `/`, `/index.html`, and nested pages should return 503.
- `/maintenance.html` should return 200 and render with CSS, fonts, icons, i18n, and contact links.
- `/src/...`, `/scripts-js-php/...`, `/partials/...`, `/favicon.ico`, and `/.well-known/...` should remain reachable if used.
- Confirm the 503 response includes `Retry-After` when `mod_headers` is available.
- Remove `maintenance.enable` after testing unless the user explicitly wants maintenance mode active.

Useful local toggle commands on Windows:

```powershell
New-Item -ItemType File -Path .\maintenance.enable -Force
Remove-Item -LiteralPath .\maintenance.enable
```

## Common Pitfalls

- Do not redirect all requests to `maintenance.html` with JavaScript; crawlers and monitors need HTTP 503.
- Do not block the assets needed by the maintenance page.
- Do not let `ErrorDocument 503` itself trigger the maintenance rule.
- Do not expose normal dynamic forms unless the user confirms they should work during maintenance.
- Do not deploy `maintenance.enable` unintentionally.
