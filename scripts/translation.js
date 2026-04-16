// scripts-js-php/translation.js
(() => {
    const LANG_STORAGE_KEY = 'siteLang';
    const LANG_FILE_PATH = '/scripts/lang.json';
    const DEFAULT_LANG = 'ru';

    const state = {
        translations: {},
        currentLang: localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG,
        isReady: false,
    };

    function getTranslationScope(root = document) {
        const scope =
        root && typeof root.querySelectorAll === 'function' ? root : document;

    const elements = [];

    if (scope instanceof Element && scope.matches('[data-i18n]')) {
        elements.push(scope);
    }

    elements.push(...scope.querySelectorAll('[data-i18n]'));
    return elements;
    }

    function applyI18nToElement(element, lang) {
        const specRaw = element.getAttribute('data-i18n');
        const dict = state.translations[lang];

    if (!specRaw || !dict) return;

    const specs = specRaw
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean);

    specs.forEach((spec) => {
        const attrMatch = spec.match(/^\[([^\]]+)\](.+)$/);

        if (attrMatch) {
            const attr = attrMatch[1].trim();
            const key = attrMatch[2].trim();
            const value = dict[key];

            if (value == null) return;

            if (attr.toLowerCase() === 'html') {
                element.innerHTML = value;
                return;
            }

            if (attr.toLowerCase() === 'text') {
                element.textContent = value;
                return;
            }

            element.setAttribute(attr, value);
            return;
        }

        const key = spec;
        const value = dict[key];

        if (value == null) return;

        element.innerHTML = value;
    });
    }

    function applyTranslations(root = document) {
        if (!state.isReady || !state.translations[state.currentLang]) return false;

        getTranslationScope(root).forEach((element) => {
            applyI18nToElement(element, state.currentLang);
        });

        syncLanguageUi();
        return true;
    }

    function syncLanguageUi() {
        document.querySelectorAll('[data-set-lang]').forEach((button) => {
            const lang = button.getAttribute('data-set-lang');
            const isActive = lang === state.currentLang;

            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        document.documentElement.setAttribute('lang', state.currentLang);
    }

    function setLang(lang) {
        if (!state.translations[lang]) return false;

        const previousLang = state.currentLang;
        state.currentLang = lang;

        localStorage.setItem(LANG_STORAGE_KEY, lang);
        applyTranslations();

        if (previousLang !== lang) {
        document.dispatchEvent(
            new CustomEvent('i18n:updated', {
            detail: { lang },
            })
        );
        }

        return true;
    }

    async function loadTranslations() {
    const response = await fetch(LANG_FILE_PATH);

    if (!response.ok) {
        throw new Error(`Failed to load translations: HTTP ${response.status}`);
    }

    state.translations = await response.json();
    state.isReady = true;
    }

    function bindLanguageSwitcher() {
        document.addEventListener('click', (event) => {
        const target =
            event.target instanceof Element
            ? event.target.closest('[data-set-lang]')
            : null;

        if (!target) return;

        const lang = target.getAttribute('data-set-lang');
        if (!lang) return;

        setLang(lang);
        });
    }

    function bindReapplyHooks() {
        document.addEventListener('partials:loaded', () => {
        applyTranslations();
        });

        document.addEventListener('partial:loaded', (event) => {
        const root = event.detail?.node || document;
        applyTranslations(root);
        });

        document.addEventListener('includes:loaded', () => {
        applyTranslations();
        });

        document.addEventListener('includes:header-loaded', () => {
        applyTranslations();
        });
    }

    async function init() {
        try {
        await loadTranslations();

        if (!state.translations[state.currentLang]) {
            state.currentLang = DEFAULT_LANG;
            localStorage.setItem(LANG_STORAGE_KEY, DEFAULT_LANG);
        }

        applyTranslations();

        document.dispatchEvent(
            new CustomEvent('i18n:ready', {
            detail: { lang: state.currentLang },
            })
        );
    } catch (error) {
        console.error('[translation.js]', error);
        }
    }

    bindLanguageSwitcher();
    bindReapplyHooks();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
    void init();
    });
    } else {
        void init();
    }

    window.SiteI18n = {
    init,
    setLang,
    apply: applyTranslations,
    getLang: () => state.currentLang,
    getDictionary: () => state.translations[state.currentLang] || {},
    };
})();