# Maintenance Page Format

Use this reference whenever creating or updating the EXPAFORCE maintenance page.

## Page Purpose

The page exists only to communicate temporary unavailability and keep contact channels open. It should feel calm, trustworthy, and operationally clear.

Avoid:

- full landing-page sections
- marketplace/service proof blocks
- large promotional hero imagery
- long sales copy
- decorative animations
- full site navigation

## Required Content

Every maintenance page must include:

- Logo: use the existing EXPAFORCE logo asset from the project (`/src/graphics/png/logo-rast.png`, `/src/graphics/svg/logo.svg`, or `/src/graphics/svg/logo-white.svg`, depending on background).
- Maintenance message: one `h1` that clearly says the site is currently under maintenance.
- Short support text: one paragraph explaining that the site will be back after technical work is complete.
- Contact block: email, phone, and messenger links when available. Reuse current contact values from `partials/footer.html` or another verified project source. Do not invent contact details.
- Language switcher: buttons for every supported language from `scripts/lang.json`, using `data-set-lang`.

## Preferred Structure

Use this standalone structure unless the existing implementation already has a better project-local pattern:

```html
<body class="maintenance-page">
  <header class="maintenance-page__header">
    <a class="maintenance-page__brand" href="/index.html" aria-label="EXPAFORCE home" data-i18n="[aria-label]maintenance-brand-aria">
      <img class="maintenance-page__logo" src="/src/graphics/png/logo-rast.png" alt="EXPAFORCE logo" data-i18n="[alt]maintenance-logo-alt">
    </a>

    <div class="maintenance-page__lang" aria-label="Language switcher" data-i18n="[aria-label]maintenance-lang-aria">
      <button type="button" class="maintenance-page__lang-button" data-set-lang="ru">RU</button>
      <button type="button" class="maintenance-page__lang-button" data-set-lang="en">EN</button>
    </div>
  </header>

  <main class="maintenance-page__main">
    <section class="section section--maintenance">
      <div class="container">
        <div class="section__inner maintenance-page__inner">
          <div class="maintenance-page__content">
            <p class="maintenance-page__eyebrow" data-i18n="[text]maintenance-eyebrow">Scheduled maintenance</p>
            <h1 class="maintenance-page__title" data-i18n="[text]maintenance-title">The site is currently under maintenance</h1>
            <p class="maintenance-page__text" data-i18n="[text]maintenance-text">We are updating the website. Please contact us directly while the site is unavailable.</p>
          </div>

          <address class="maintenance-page__contacts" aria-label="Contact details" data-i18n="[aria-label]maintenance-contacts-aria">
            <p class="maintenance-page__contacts-title" data-i18n="[text]maintenance-contacts-title">Contact us</p>
            <a class="maintenance-page__contact" href="mailto:info@expaforce.com">
              <span data-i18n="[text]maintenance-email-label">Email</span>
              <strong>info@expaforce.com</strong>
            </a>
            <a class="maintenance-page__contact" href="tel:88005553535">
              <span data-i18n="[text]maintenance-phone-label">Phone</span>
              <strong>8 800 5553535</strong>
            </a>
          </address>
        </div>
      </div>
    </section>
  </main>

  <script src="/scripts/translation.js" defer></script>
</body>
```

## Translation Rules

Use `translation-system` for all copy changes.

Required translation-key group:

- `maintenance-meta-title`
- `maintenance-meta-description`
- `maintenance-brand-aria`
- `maintenance-logo-alt`
- `maintenance-lang-aria`
- `maintenance-eyebrow`
- `maintenance-title`
- `maintenance-text`
- `maintenance-contacts-aria`
- `maintenance-contacts-title`
- `maintenance-email-label`
- `maintenance-phone-label`
- `maintenance-messengers-label` if messenger links are present
- `maintenance-telegram-aria` if Telegram is present
- `maintenance-whatsapp-aria` if WhatsApp is present

Rules:

- Add every key to every language in `scripts/lang.json`.
- Use `data-i18n` on all visible copy and accessibility labels.
- Use `data-set-lang` for language buttons; do not create a separate language-switching script.
- Match the supported language list to the top-level language keys in `scripts/lang.json`.

## Layout Rules

- Use a single focused page, not multiple business sections.
- Use `section > container > section__inner` for the main content area.
- Keep layout grid/flex controlled by parent wrappers and `gap`.
- Use spacing tokens from the project design system.
- Do not use arbitrary offsets, hardcoded heights, negative margins, or transforms for normal layout.
- On mobile, stack logo/language controls and content/contact blocks cleanly.
- If the content/contact area becomes two-column on desktop, run the `section-visual-balance` checklist.

## Contact Rules

- Reuse verified project contacts from `partials/footer.html`, contact sections, or existing translation keys.
- Keep contact links functional: `mailto:`, `tel:`, and real messenger URLs when available.
- If a messenger URL is still `#`, either replace it with a verified URL or omit that messenger from the maintenance page.
- The contact block must remain visible without scrolling on common desktop viewports when practical.

## Metadata Rules

For a temporary maintenance page:

```html
<title data-i18n="[text]maintenance-meta-title">Site maintenance | EXPAFORCE</title>
<meta name="description" content="EXPAFORCE website is temporarily under maintenance. Contact us by email or phone while the site is unavailable." data-i18n="[content]maintenance-meta-description">
<meta name="robots" content="noindex, nofollow">
```

If the server can be configured, serve maintenance responses with HTTP `503 Service Unavailable` and a `Retry-After` header.

Do not add normal landing-page schema to the maintenance page.
