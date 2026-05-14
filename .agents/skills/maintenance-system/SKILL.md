---
name: maintenance-system
description: Implement or update the EXPOForce-style maintenance system for static/Apache websites: marker-file controlled HTTP 503 maintenance mode, branded maintenance.html, asset allowlist, multilingual copy, right-edge admin access drawer, and a temporary cookie-based preview bypass that opens the real site after login. Use when Codex is asked to create, repair, review, enable, disable, or document maintenance/technical works/under-construction behavior.
---

# Maintenance System

## Goal

Build maintenance mode as a server-side gate with a preview bypass:

1. A zero-byte `maintenance.enable` file turns maintenance mode on.
2. Apache returns `503 Service Unavailable` for normal pages and serves `/maintenance.html` as `ErrorDocument 503`.
3. `/maintenance.html` stays visible as a real maintenance page for visitors.
4. An `Admin access` button opens a drawer from the right edge of the screen.
5. Correct credentials set a temporary preview cookie and redirect the user back to the site.
6. `.htaccess` lets requests with that cookie bypass maintenance mode.

This is a temporary preview gate, not real security. If the site contains sensitive data, recommend Basic Auth, `.htpasswd`, Cloudflare Access, hosting-level password protection, or backend authentication.

## Core Contract

- Use `maintenance.enable` in the web root as the on/off marker.
- Do not use JavaScript redirects as the maintenance gate.
- Return HTTP `503` for blocked public pages.
- Serve `/maintenance.html` as the `ErrorDocument 503`.
- Keep `/maintenance.html`, required CSS/JS/assets, favicon, and well-known files reachable.
- Add a cookie bypass condition before URI allowlist checks.
- Keep the maintenance content visible; do not hide it behind the access form.
- The access form must be in a right-side drawer opened by a button.
- On successful access, set the preview cookie and redirect to the requested page; if already on `/maintenance.html`, redirect to `/index.html`.
- Add or update i18n keys for every supported language when the project uses `data-i18n`.
- Rebuild compiled CSS when the repo commits built CSS.

## Default Preview Credentials

Use these defaults for this project unless the user provides different temporary credentials:

```txt
login: admin
password: bababiboba
sha256("admin:bababiboba"): 72a100f863e29954b6c05a7f1a48a12c7c497701333f87af89447113f52e3d26
cookie: expaforceMaintenanceAuthorized
```

Use the hash as both the comparison target and the cookie value. Do not present this as secure authentication; the frontend code and cookie value are inspectable.

## Apache Pattern

Preserve canonical host/HTTPS redirects above this block if the site needs them before maintenance mode.

```apache
RewriteEngine On

# Enable maintenance mode by creating /maintenance.enable in the web root.
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

Adjust the asset allowlist to the actual repo. Keep it minimal, but do not block CSS, JS, fonts, images, translation JSON, favicons, or scripts required by `maintenance.html`.

## Page Structure

Use the site's normal section/container/card/button/form classes when available. The maintenance page should have:

- `section.section--maintenance.maintenance`
- a top row with logo, language switcher, and secondary `Admin access` button
- visible maintenance copy and contact/status cards
- `.maintenance__auth-backdrop`
- right-edge `.maintenance__auth-drawer`
- `.maintenance__auth` card containing the form
- `/scripts/translation.js` before `/scripts/maintenance-auth.js`

Do not add `hidden` to the main maintenance layout. Do not make the form the first or only visible page content.

For the canonical markup and JS shape, read `references/maintenance-page-format.md`.
If creating a new page from scratch, use `assets/maintenance-page-template.html` as the starting HTML and adapt paths/copy to the repo.

## Drawer Behavior

The access drawer must:

- open from the right when `[data-maintenance-auth-open]` is clicked
- set `aria-expanded="true"` on the open button
- set `aria-hidden="false"` on the drawer
- reveal a backdrop
- focus the login field after opening
- close on close button, backdrop click, and `Escape`
- show an `aria-live="polite"` error on invalid credentials
- keep the page in maintenance state when credentials are wrong

On valid credentials:

- set `sessionStorage["expaforceMaintenanceAuthorized"] = "true"` as a tab/session convenience flag
- set cookie `expaforceMaintenanceAuthorized=<hash>; Path=/; Max-Age=86400; SameSite=Lax`
- add `Secure` only when `window.location.protocol === "https:"`
- redirect to the current requested path, or `/index.html` when the current path is `/maintenance.html`

Include a Web Crypto fallback or avoid relying solely on `crypto.subtle`; otherwise correct credentials can fail on non-secure origins or older browsers.

## Styling Rules

Scope styles under `.maintenance` / `.page--maintenance` and reuse project tokens:

- existing colors, radius, shadows, transitions, z-index variables
- existing `.button`, `.card`, `.form-field`, `.form-input`
- tokenized gaps and padding
- no arbitrary offsets to position normal content

Drawer essentials:

- `position: fixed`
- `inset-block: 0`
- `inset-inline-end: 0`
- `width: min(100%, 440px)` or the closest project-appropriate drawer width
- start at `transform: translateX(100%)`
- open via `.page--maintenance.is-auth-drawer-open .maintenance__auth-drawer { transform: translateX(0); }`
- use backdrop under the drawer
- keep mobile width at `100%` and tokenized padding

## I18n Keys

When the repo uses `scripts/lang.json` and `data-i18n`, add the access keys to every supported language:

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

Localize values for non-English languages. Keep key names identical across languages.

## Validation

Always validate behavior, not just file presence:

- With no `maintenance.enable`, normal pages load normally.
- With `maintenance.enable` and no cookie, `/`, `/index.html`, and nested pages return `503`.
- With `maintenance.enable` and no cookie, `/maintenance.html` returns `200` and renders CSS, JS, language switching, contacts, and the drawer button.
- Asset paths used by the page remain reachable.
- Drawer opens from the right, focuses login, closes via close/backdrop/Escape, and does not hide maintenance content.
- Wrong credentials show an error and do not redirect.
- Correct credentials set the cookie and redirect to `/index.html` from `/maintenance.html`.
- Correct credentials from a nested blocked URL redirect back to that URL when Apache serves `maintenance.html` as `ErrorDocument 503`.
- A request with the preview cookie bypasses the `.htaccess` maintenance rule.
- `Retry-After` and no-store cache headers are present on `503` responses when `mod_headers` is available.
- Remove `maintenance.enable` after testing unless the user explicitly wants maintenance mode active.

Useful local toggle commands on Windows:

```powershell
New-Item -ItemType File -Path .\maintenance.enable -Force
Remove-Item -LiteralPath .\maintenance.enable
```

## Common Pitfalls

- Do not use a frontend-only overlay when Apache maintenance mode is required.
- Do not hide all maintenance copy until login.
- Do not set only `sessionStorage`; Apache cannot read it. Use the preview cookie.
- Do not forget the cookie bypass condition in `.htaccess`.
- Do not block `/scripts/`, `/scripts-js-php/`, translation JSON, or CSS needed by `maintenance.html`.
- Do not let `ErrorDocument 503` itself trigger the maintenance rule.
- Do not call this real authentication or promise security.
- Do not deploy `maintenance.enable` unintentionally.
