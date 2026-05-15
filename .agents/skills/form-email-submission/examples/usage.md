# Form Email Submission - Implementation Guide

## Quick Start

### Step 1: Copy files to project

1. Copy `form-handler.php` to your project root (or `/scripts/` folder)
2. Copy `form-validator.js` to your `/scripts/` folder
3. Update email in `form-handler.php`:
   ```php
   $recipient_email = 'info@expaforce.com';  // Your email here
   ```

### Step 2: Add form to HTML page

Use the structure below in your CTA section:

```html
<form 
  id="contact-form" 
  data-form-handler="/form-handler.php"
  data-submit-redirect="/thank-you"
>
  <div class="form-field">
    <label for="name" class="form-label">Name</label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      class="form-input"
      required
    >
    <span class="form-error" role="alert"></span>
  </div>

  <div class="form-field">
    <label for="email" class="form-label">Email</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      class="form-input"
      required
    >
    <span class="form-error" role="alert"></span>
  </div>

  <div class="form-field">
    <label for="phone" class="form-label">Phone (optional)</label>
    <input 
      type="tel" 
      id="phone" 
      name="phone" 
      class="form-input"
    >
    <span class="form-error" role="alert"></span>
  </div>

  <div class="form-field">
    <label for="message" class="form-label">Message</label>
    <textarea 
      id="message" 
      name="message" 
      class="form-input"
      required
    ></textarea>
    <span class="form-error" role="alert"></span>
  </div>

  <button type="submit" class="button button--primary">Send</button>
  <span class="form-status" role="alert"></span>
</form>
```

### Step 3: Add script before closing `</body>`

```html
<script src="/scripts/form-validator.js"></script>
</body>
```

### Step 4: Add minimal CSS (if needed)

If your site doesn't have form styling, add to your CSS:

```css
.form-input.has-error {
  border-color: #f56565;
  background-color: #fff5f5;
}

.form-error {
  display: block;
  margin-top: 6px;
  color: #f56565;
  font-size: 13px;
  min-height: 20px;
}

.form-status {
  display: block;
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.form-status--success {
  background: #c6f6d5;
  color: #22543d;
}

.form-status--error {
  background: #fed7d7;
  color: #742a2a;
}
```

---

## Using with Multilingual Sites

If your site uses the translation system (`data-i18n` attributes):

### Add translation keys to `scripts/lang.json`:

```json
{
  "en": {
    "form-error-required": "This field is required",
    "form-error-email": "Please enter a valid email address",
    "form-error-phone": "Please enter a valid phone number",
    "form-error-minLength": "Message must be at least 10 characters",
    "form-error-submit": "Error sending form",
    "form-success": "Thank you! Your message has been sent."
  },
  "ru": {
    "form-error-required": "Это поле обязательно",
    "form-error-email": "Пожалуйста, введите корректный email",
    "form-error-phone": "Пожалуйста, введите корректный номер телефона",
    "form-error-minLength": "Сообщение должно быть не менее 10 символов",
    "form-error-submit": "Ошибка при отправке формы",
    "form-success": "Спасибо! Ваше сообщение отправлено."
  }
}
```

### Update form labels with i18n:

```html
<label for="name" class="form-label" data-i18n="[text]form-label-name">Name</label>
```

The validator will automatically use translations if available.

---

## Customizing Validation Rules

Edit `form-validator.js` to change validation rules:

### Change phone validation

```javascript
validatePhone(phone) {
  // Example: Russian phone format (11 digits)
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length === 11 && /^[79]/.test(digits);
}
```

### Change required fields

In `form-handler.php`:

```php
$required_fields = ['name', 'email', 'message', 'company'];  // Add 'company'
```

### Add custom field validation

In `validateField()` method:

```javascript
case 'checkbox':
  if (field.type === 'checkbox' && field.hasAttribute('required')) {
    if (!field.checked) {
      error = 'You must agree to terms';
    }
  }
  break;
```

---

## Customizing Email Output

Edit `form-handler.php` to change how email is formatted:

### Change subject line

```php
$subject = 'New ' . $data['category'] . ' inquiry from ' . $site_url;
```

### Add more fields to email

```php
$company = sanitizeInput($data['company'] ?? '');
$body .= "Company: " . $company . "\n";
```

### Send to multiple recipients

```php
$recipient_email = 'info@expaforce.com, sales@expaforce.com';
```

---

## Troubleshooting

### Form submits but email doesn't arrive

1. **Check mail function in PHP:**
   - In CPanel: Setup Mail Function
   - Or test with: `php -r "echo ini_get('sendmail_path');"`

2. **Check spam folder**
   - Emails might be filtered

3. **Enable PHP error logs:**
   - In `form-handler.php`, add after headers:
   ```php
   error_log("Form submission received from: " . $_SERVER['REMOTE_ADDR']);
   error_log("Mail sent to: " . $recipient_email);
   ```
   - Check CPanel > Error Logs

4. **Test mail function directly:**
   Create `test-mail.php`:
   ```php
   <?php
   $to = 'your-email@gmail.com';
   $subject = 'Test Email';
   $message = 'This is a test';
   $result = mail($to, $subject, $message);
   echo $result ? 'Mail sent' : 'Mail failed';
   ?>
   ```

### Validation errors not showing

1. Check browser console (F12 > Console) for JS errors
2. Verify `form-validator.js` is loaded (F12 > Network tab)
3. Check form has `data-form-handler` attribute
4. Verify input `name` attributes match

### CORS errors (if handler on different domain)

Already handled in `form-handler.php`:
```php
header('Access-Control-Allow-Origin: *');
```

---

## Security Notes

The skill includes:
- Input sanitization with `htmlspecialchars()` and `strip_tags()`
- Rate limiting (5 attempts per IP per hour by default)
- Spam detection (multiple URLs, excessive newlines)
- Email format validation with `filter_var()`
- Server-side re-validation of all fields

**Additional security (optional):**

### Add CSRF protection

Generate token in form:
```php
session_start();
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
```

Add to form:
```html
<input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
```

Validate in handler:
```php
if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
  throw new Exception('Invalid token');
}
```

### Add reCAPTCHA

1. Get keys from https://www.google.com/recaptcha/admin
2. Add to form:
```html
<div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
<script src="https://www.google.com/recaptcha/api.js"></script>
```

3. Verify in PHP:
```php
$recaptcha_secret = 'YOUR_SECRET_KEY';
$recaptcha_token = $_POST['g-recaptcha-response'];
$response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$recaptcha_secret&response=$recaptcha_token");
$data = json_decode($response);
if (!$data->success) {
  throw new Exception('reCAPTCHA verification failed');
}
```

---

## Files Included

```
form-email-submission/
├── SKILL.md (full documentation)
├── backend/
│   └── form-handler.php (PHP email handler)
├── frontend/
│   └── form-validator.js (JavaScript validation)
└── examples/
    ├── basic-form.html (working example)
    └── usage.md (this file)
```

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review SKILL.md for detailed documentation
3. Check form-handler.php error logs in CPanel
4. Test with basic-form.html to isolate issues
