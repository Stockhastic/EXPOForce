/**
 * Client-side validation and AJAX submission for forms with data-form-handler.
 */
class FormValidator {
  constructor() {
    this.forms = document.querySelectorAll("[data-form-handler]");
    this.init();
  }

  init() {
    this.forms.forEach((form) => this.attachFormHandlers(form));
  }

  attachFormHandlers(form) {
    form.setAttribute("novalidate", "novalidate");
    form.addEventListener("submit", (event) => this.handleSubmit(event, form));

    form.querySelectorAll("[name]").forEach((field) => {
      if (this.isHoneypot(field)) return;

      const eventName = field.type === "checkbox" ? "change" : "blur";
      field.addEventListener(eventName, () => this.validateField(field));
      field.addEventListener("input", () => {
        this.clearFieldError(field);
        this.clearFormStatus(form);
      });
    });
  }

  validateField(field) {
    if (this.isHoneypot(field)) return true;

    const value = this.getFieldValue(field);
    const isRequired = field.hasAttribute("required");
    const minLength = Number(field.getAttribute("minlength") || field.dataset.minLength || 0);
    const maxLength = Number(field.getAttribute("maxlength") || field.dataset.maxLength || 0);
    const validationType = field.dataset.validate || field.type || field.tagName.toLowerCase();
    let errorKey = "";

    if (field.type === "checkbox") {
      if (isRequired && !field.checked) errorKey = "form-error-consent";
    } else if (isRequired && !value) {
      errorKey = "form-error-required";
    }

    if (!errorKey && value) {
      if (minLength > 0 && value.length < minLength) {
        errorKey = "form-error-min-length";
      } else if (maxLength > 0 && value.length > maxLength) {
        errorKey = "form-error-max-length";
      } else if (validationType === "email" && !this.validateEmail(value)) {
        errorKey = "form-error-email";
      } else if (validationType === "phone-or-email" && !this.validatePhoneOrEmail(value)) {
        errorKey = "form-error-phone";
      } else if (validationType === "url" && !this.validateUrl(value)) {
        errorKey = "form-error-url";
      } else if (field.name === "full_name" && !/\p{L}/u.test(value)) {
        errorKey = "form-error-name";
      }
    }

    if (errorKey) {
      this.showFieldError(field, this.translate(errorKey));
      return false;
    }

    this.clearFieldError(field);
    return true;
  }

  validateForm(form) {
    let isValid = true;

    form.querySelectorAll("[name]").forEach((field) => {
      if (!this.validateField(field)) isValid = false;
    });

    return isValid;
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePhoneOrEmail(value) {
    if (value.includes("@")) return this.validateEmail(value);

    const normalized = value.replace(/[()\-\s]/g, "");
    const digits = normalized.replace(/\D/g, "");
    return /^\+?\d+$/.test(normalized) && digits.length >= 7 && digits.length <= 20;
  }

  validateUrl(url) {
    try {
      const parsed = new URL(url);
      return Boolean(parsed.protocol && parsed.host);
    } catch {
      return false;
    }
  }

  showFieldError(field, message) {
    const errorElement = this.getFieldErrorElement(field);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.setAttribute("role", "alert");
    }

    field.setAttribute("aria-invalid", "true");
    field.classList.add("has-error");
    field.closest(".form-field")?.classList.add("is-invalid");
  }

  clearFieldError(field) {
    const errorElement = this.getFieldErrorElement(field);

    if (errorElement) errorElement.textContent = "";

    field.removeAttribute("aria-invalid");
    field.classList.remove("has-error");
    field.closest(".form-field")?.classList.remove("is-invalid");
  }

  getFieldErrorElement(field) {
    return field.closest(".form-field")?.querySelector(".form-error") || null;
  }

  getFieldValue(field) {
    return String(field.value || "").trim();
  }

  isHoneypot(field) {
    return field.closest("[data-form-honeypot]") !== null;
  }

  async handleSubmit(event, form) {
    event.preventDefault();
    this.clearFormStatus(form);

    if (!this.validateForm(form)) {
      this.showFormError(form, this.translate("form-error-fix-fields"));
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = this.translate("form-submit-loading");
    }

    const formData = new FormData(form);
    formData.set("page_url", window.location.href);
    formData.set("page_title", document.title);
    formData.set("submitted_at", new Date().toISOString());

    try {
      const response = await fetch(form.getAttribute("data-form-handler"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        this.applyServerErrors(form, result.errors || {});
        this.showFormError(form, this.translate(result.message_key || "form-error-submit"));
        return;
      }

      form.reset();
      this.showFormSuccess(form, this.translate(result.message_key || "form-success-submit"));

      const redirectUrl = form.getAttribute("data-submit-redirect");
      if (redirectUrl) {
        window.setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1200);
      }
    } catch (error) {
      console.error("[form-validator]", error);
      this.showFormError(form, this.translate("form-error-network"));
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  }

  applyServerErrors(form, errors) {
    Object.entries(errors).forEach(([fieldName, errorKey]) => {
      const field = form.querySelector(`[name="${this.escapeSelector(fieldName)}"]`);
      if (field) this.showFieldError(field, this.translate(errorKey));
    });
  }

  showFormSuccess(form, message) {
    this.showFormStatus(form, message, "success");
  }

  showFormError(form, message) {
    this.showFormStatus(form, message, "error");
  }

  showFormStatus(form, message, type) {
    const statusElement = form.querySelector(".form-status");
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.classList.toggle("form-status--success", type === "success");
    statusElement.classList.toggle("form-status--error", type === "error");
    statusElement.setAttribute("role", "alert");
  }

  clearFormStatus(form) {
    const statusElement = form.querySelector(".form-status");
    if (!statusElement) return;

    statusElement.textContent = "";
    statusElement.classList.remove("form-status--success", "form-status--error");
  }

  translate(key) {
    const dictionary = window.SiteI18n?.getDictionary?.() || {};
    return dictionary[key] || this.fallbackMessages()[key] || key;
  }

  fallbackMessages() {
    const lang = document.documentElement.getAttribute("lang") || "ru";

    if (lang.toLowerCase().startsWith("ru")) {
      return {
        "form-error-required": "Это поле обязательно.",
        "form-error-email": "Введите корректный email.",
        "form-error-phone": "Введите корректный телефон или email.",
        "form-error-name": "Введите корректное имя.",
        "form-error-min-length": "Добавьте немного больше деталей.",
        "form-error-max-length": "Текст слишком длинный.",
        "form-error-url": "Введите корректную ссылку.",
        "form-error-consent": "Нужно согласие на обработку персональных данных.",
        "form-error-spam": "Сообщение похоже на спам. Сократите ссылки и повторите отправку.",
        "form-error-fix-fields": "Проверьте выделенные поля.",
        "form-error-submit": "Не удалось отправить форму. Попробуйте позже или напишите на почту.",
        "form-error-network": "Ошибка сети. Проверьте соединение и попробуйте ещё раз.",
        "form-error-rate-limit": "Слишком много отправок. Попробуйте позже.",
        "form-error-method": "Метод отправки не поддерживается.",
        "form-submit-loading": "Отправляем...",
        "form-success-submit": "Спасибо. Заявка отправлена, мы свяжемся с вами.",
      };
    }

    return {
      "form-error-required": "This field is required.",
      "form-error-email": "Enter a valid email address.",
      "form-error-phone": "Enter a valid phone number or email.",
      "form-error-name": "Enter a valid name.",
      "form-error-min-length": "Add a little more detail.",
      "form-error-max-length": "This field is too long.",
      "form-error-consent": "Consent is required.",
      "form-error-spam": "The message looks like spam. Reduce links and try again.",
      "form-error-fix-fields": "Please check the highlighted fields.",
      "form-error-submit": "The form could not be sent. Please try again.",
      "form-error-network": "Network error. Please try again.",
      "form-error-rate-limit": "Too many submissions. Please try again later.",
      "form-error-method": "This submission method is not supported.",
      "form-submit-loading": "Sending...",
      "form-success-submit": "Thank you. We received your request.",
    };
  }

  escapeSelector(value) {
    if (window.CSS?.escape) return window.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new FormValidator());
} else {
  new FormValidator();
}
