---
name: translation-system
description: Use this skill when building or updating multilingual static websites that use scripts-js-php/translation.js, scripts-js-php/lang.json, and data-i18n attributes in HTML.
---

# Translation System

Use this skill for the project's lightweight static i18n system.

## Scope
This system is for:
- static HTML pages
- client-side language switching
- `lang.json` translation storage
- `data-i18n`-driven UI translation
- reapplying translations after partial injection

This system is not for:
- framework i18n libraries
- server-side localization
- pricing logic
- CMS-driven translation workflows
- unrelated runtime logic

## Files
Main files:
- `scripts/lang.json`
- `scripts/translation.js`

Optional related markup:
- language switcher buttons with `data-set-lang`
- partials that may require translation reapply after injection

## Core rules

### 1. Keep `translation.js` i18n-only
`translation.js` should only handle:
- loading translations
- storing current language
- applying translations to DOM
- syncing language switcher state
- reapplying translations after partial injection
- exposing a minimal API if needed

Do not put into `translation.js`:
- prices
- forms
- sliders
- analytics
- menus
- animations
- business logic
- unrelated UI behavior

### 2. Keep `lang.json` language-only
`lang.json` must contain only translation strings.

Do not store:
- prices
- component config
- API payloads
- business data unrelated to language
- layout structures

### 3. Use `data-i18n` consistently
Use `data-i18n` for every translatable UI element.

Supported patterns:
- `data-i18n="hero-title"`
- `data-i18n="[text]hero-title"`
- `data-i18n="[html]hero-title"`
- `data-i18n="[placeholder]contact-name-placeholder"`
- `data-i18n="[title]tooltip-key"`

Multiple instructions may be separated with `;`.

### 4. Keep translation keys consistent across languages
Every supported language must contain the same set of keys.

If a key is added in one language, add it to all supported languages in the same task.

Do not leave languages structurally out of sync.

## Key naming rules

Use lowercase kebab-case.

Good:
- `header-home`
- `header-services`
- `hero-title`
- `hero-text`
- `hero-button`
- `contact-name-placeholder`

Bad:
- `text1`
- `mainTitleFinal`
- `label_2`
- `newThing`
- `aaa`

Keys should be grouped by block or feature.

## Content rules

### Use HTML translations only when needed
Use HTML only for:
- `<br>`
- inline highlight spans
- small formatting fragments

Do not place large layout fragments inside translation strings.

### Prefer text when markup is not needed
Use:
- `[text]...` for plain text
- `[placeholder]...` for placeholders
- `[title]...` for titles
- `[aria-label]...` for accessibility labels

### Do not hardcode translatable UI
If an element already uses `data-i18n`, update `lang.json` instead of hardcoding content into the HTML.

## `lang.json` structure

Use this structure:

```json
{
  "ru": {
    "hero-title": "Ваш успех — <span class=\"special-text\">наша миссия</span>"
  },
  "en": {
    "hero-title": "Your success is <span class=\"special-text\">our mission</span>"
  }
}