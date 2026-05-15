/**
 * Form Validator
 * 
 * Client-side validation and AJAX submission for forms with data-form-handler attribute
 * 
 * Usage:
 * 1. Add data-form-handler="/form-handler.php" to form
 * 2. Add class="form-input" to inputs
 * 3. Add .form-error spans for error display
 * 4. Include this script before closing </body>
 */

class FormValidator {
  constructor() {
    this.forms = document.querySelectorAll('[data-form-handler]');
    this.init();
  }

  init() {
    if (this.forms.length === 0) {
      console.warn('FormValidator: No forms with data-form-handler found');
      return;
    }

    this.forms.forEach(form => this.attachFormHandlers(form));
  }

  attachFormHandlers(form) {
    form.addEventListener('submit', e => this.handleSubmit(e, form));

    // Add real-time validation on blur/change
    const inputs = form.querySelectorAll('[name]');
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        input.addEventListener('change', () => this.validateCheckbox(input));
      } else {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('change', () => this.clearFieldError(input));
      }
    });
  }

  /**
   * Validate single field
   */
  validateField(field) {
    const name = field.name;
    const value = field.value.trim();
    const type = field.type || field.tagName.toLowerCase();
    const isRequired = field.hasAttribute('required');
    let error = null;

    // Required check
    if (isRequired && !value) {
      // Skip for checkbox - handle separately
      if (field.type === 'checkbox') {
        if (!field.checked) {
          error = this.getErrorMessage('required', name);
        }
      } else {
        error = this.getErrorMessage('required', name);
      }
    }

    // Skip validation if field is empty and not required
    if (!isRequired && !value && field.type !== 'checkbox') {
      this.clearFieldError(field);
      return true;
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        if (!this.validateEmail(value)) {
          error = this.getErrorMessage('email', name);
        }
        break;

      case 'tel':
        if (!this.validatePhoneOrEmail(value)) {
          error = this.getErrorMessage('phone', name);
        }
        break;

      case 'textarea':
        if (value.length < 10) {
          error = this.getErrorMessage('minLength', name);
        }
        break;

      case 'url':
        if (!this.validateUrl(value)) {
          error = this.getErrorMessage('url', name);
        }
        break;

      case 'checkbox':
        if (field.hasAttribute('required') && !field.checked) {
          error = this.getErrorMessage('required', name);
        }
        break;
    }

    if (error) {
      this.showFieldError(field, error);
      return false;
    } else {
      this.clearFieldError(field);
      return true;
    }
  }

  /**
   * Validate checkbox field
   */
  validateCheckbox(field) {
    if (field.hasAttribute('required') && !field.checked) {
      this.showFieldError(field, this.getErrorMessage('consent', field.name));
      return false;
    }
    this.clearFieldError(field);
    return true;
  }

  /**
   * Validate all form fields
   */
  validateForm(form) {
    const inputs = form.querySelectorAll('[name]');
    let isValid = true;

    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        if (!this.validateCheckbox(input)) {
          isValid = false;
        }
      } else {
        if (!this.validateField(input)) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  /**
   * Email validation (RFC 5322 simplified)
   */
  validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  /**
   * Validate phone or email (for combined phone/email field)
   */
  validatePhoneOrEmail(value) {
    // Check if it looks like an email
    if (value.includes('@')) {
      return this.validateEmail(value);
    } else {
      // Treat as phone
      return this.validatePhone(value);
    }
  }

  /**
   * URL validation
   */
  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Show error message
   */
  showFieldError(field, message) {
    const errorSpan = field.closest('[class*="form-field"]')?.querySelector('.form-error');
    
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.setAttribute('role', 'alert');
      field.setAttribute('aria-invalid', 'true');
    }

    field.classList.add('has-error');
  }

  /**
   * Clear error message
   */
  clearFieldError(field) {
    const errorSpan = field.closest('[class*="form-field"]')?.querySelector('.form-error');
    
    if (errorSpan) {
      errorSpan.textContent = '';
    }

    field.removeAttribute('aria-invalid');
    field.classList.remove('has-error');
  }

  /**
   * Get error message (with i18n support)
   */
  getErrorMessage(type, fieldName) {
    const messages = {
      required: `${fieldName} is required`,
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone or email',
      minLength: 'Message must be at least 10 characters',
      url: 'Please enter a valid URL',
      consent: 'You must agree to data processing'
    };

    // Check if translation system is available
    if (typeof window.getTranslation === 'function') {
      const key = `form-error-${type}`;
      const translated = window.getTranslation(key);
      if (translated && translated !== key) {
        return translated;
      }
    }

    return messages[type] || 'Invalid field';
  }

  /**
   * Handle form submission
   */
  async handleSubmit(e, form) {
    e.preventDefault();

    // Validate form
    if (!this.validateForm(form)) {
      console.log('Form validation failed');
      return;
    }

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Get handler URL
    const handlerUrl = form.getAttribute('data-form-handler');
    const redirectUrl = form.getAttribute('data-submit-redirect');

    try {
      // Send via AJAX
      const response = await fetch(handlerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        this.showFormSuccess(form, result.message);

        // Reset form
        form.reset();

        // Redirect if specified
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);
        }
      } else {
        // Show validation errors from server
        if (result.errors && typeof result.errors === 'object') {
          Object.keys(result.errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
              this.showFieldError(field, result.errors[fieldName]);
            }
          });
        }

        // Show general error
        this.showFormError(form, result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormError(form, 'An error occurred. Please try again.');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  /**
   * Show form success message
   */
  showFormSuccess(form, message) {
    const statusSpan = form.querySelector('.form-status');
    
    if (statusSpan) {
      statusSpan.textContent = message;
      statusSpan.classList.add('form-status--success');
      statusSpan.classList.remove('form-status--error');
      statusSpan.setAttribute('role', 'alert');
    }
  }

  /**
   * Show form error message
   */
  showFormError(form, message) {
    const statusSpan = form.querySelector('.form-status');
    
    if (statusSpan) {
      statusSpan.textContent = message;
      statusSpan.classList.add('form-status--error');
      statusSpan.classList.remove('form-status--success');
      statusSpan.setAttribute('role', 'alert');
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
  });
} else {
  new FormValidator();
}
