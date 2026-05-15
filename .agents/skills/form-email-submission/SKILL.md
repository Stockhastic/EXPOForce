---
name: form-email-submission
description: Add form validation and email submission to website forms using PHP mail() and JavaScript validation
---

# Form Email Submission Skill

## Overview
Add client-side form validation and server-side email submission functionality to website forms.

This skill integrates three components:
1. **HTML form** with semantic field structure and translatable labels
2. **JavaScript validation** for email, phone, required fields, and custom rules
3. **PHP email handler** using native `mail()` function (CPanel/Hayhost compatible)

## When to use this skill
- Adding form submission to landing pages or CTA sections
- Implementing feedback, contact, or lead forms with email delivery
- Adding validation rules beyond `<input required>`
- Creating forms that work across multiple pages with reusable components

## How it works

### Input configuration
When requested to add form submission, you need:

1. **Form selector or ID**: Where the form exists in HTML
   - Example: `.contact-form`, `#feedback-form`

2. **Form fields**: Array of field names and their types
   ```
   - name (text, required)
   - email (email, required)
   - phone (tel, optional, validates digits)
   - message (textarea, required)
   ```

3. **Email recipient**: Target email address
   - Example: `info@expaforce.com`
   - Can be dynamic: `info@${domain}.com`

4. **Email subject**: Subject line for outgoing email
   - Example: `"Новое сообщение с сайта"`

5. **Optional: Redirect URL** after successful submission
   - Example: `/thank-you` or empty for inline message

6. **Optional: Multilingual** yes/no
   - If yes, use translation system with `data-i18n`
   - If no, hardcode messages

### Output deliverables
This skill creates or modifies:

1. **[form-handler.php]** — Server-side email submission
   - Validates fields on server
   - Sanitizes input
   - Sends via PHP `mail()`
   - Returns JSON response

2. **[form-validator.js]** — Client-side validation
   - Validates email format
   - Validates phone (digits only)
   - Validates required fields
   - Shows inline error messages
   - Prevents double submission

3. **Form HTML** in target page
   - Semantic `<form>` tag
   - Proper `<input>` types
   - ARIA labels
   - Error message containers
   - Success/loading states

## Implementation steps

### Step 1: Prepare form fields list
Define what fields you need:
```
- Text fields (name, company, etc.)
- Email field (validation: format)
- Phone field (validation: digits, optional format)
- Textarea (message)
- Optional checkboxes or selects
```

### Step 2: Set recipient email
- Use static email: `info@expaforce.com`
- Or extract domain dynamically in PHP

### Step 3: Add HTML form to page
Use semantic form structure with:
- Unique form ID/class
- Proper input types (`email`, `tel`, `text`, `textarea`)
- Error containers (`.form-error` or similar)
- Submit button
- Optional: Success message container

### Step 4: Include JavaScript
Add `<script src="/scripts/form-validator.js"></script>` before closing `</body>`

### Step 5: Copy PHP handler
Place `form-handler.php` in root or `/scripts/` directory

### Step 6: Configure form element
Add `data-form-handler` attribute to form:
```html
<form 
  id="contact-form" 
  data-form-handler="/form-handler.php"
  data-submit-redirect="/thank-you"
>
```

## Form HTML structure

Minimal structure:
```html
<form id="contact-form" data-form-handler="/form-handler.php">
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
    <label for="phone" class="form-label">Phone</label>
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

## Validation rules

### JavaScript (client-side)
- **Required fields**: Show inline error if empty
- **Email**: Must match RFC 5322 pattern (contains @ and domain)
- **Phone**: Accept digits, +, -, (), spaces; error if non-numeric
- **Message**: Minimum 10 characters recommended
- **Double submission**: Disable button while sending

### PHP (server-side)
- Re-validate all required fields
- Validate email format using `filter_var()`
- Sanitize text with `htmlspecialchars()` and `strip_tags()`
- Max length limits to prevent abuse
- Check for spam patterns (multiple URLs, etc.)
- Return structured JSON response

## Email template

PHP generates plaintext email:
```
From: {name} <{email}>
Phone: {phone}
Subject: New form submission from site

Message:
{message}

---
Sent from: {user_agent}
IP: {remote_addr}
```

## Configuration

### Email recipient
In `form-handler.php`, edit:
```php
$recipient_email = 'info@expaforce.com';
```

Or make it dynamic:
```php
$domain = $_SERVER['HTTP_HOST'];
$recipient_email = 'info@' . $domain;
```

### Field validation
Customize in `form-validator.js`:
```javascript
const fieldRules = {
  name: { required: true, minLength: 2 },
  email: { required: true, type: 'email' },
  phone: { required: false, type: 'tel' },
  message: { required: true, minLength: 10 }
};
```

### Error messages (i18n)
For multilingual sites, use translation keys:
```html
<span class="form-error" data-i18n="[text]form-error-required"></span>
```

Add to `scripts/lang.json`:
```json
{
  "en": {
    "form-error-required": "This field is required",
    "form-error-email": "Please enter a valid email",
    "form-error-submit": "Error sending form"
  },
  "ru": {
    "form-error-required": "Это поле обязательно",
    "form-error-email": "Пожалуйста, введите корректный email",
    "form-error-submit": "Ошибка при отправке формы"
  }
}
```

## Security considerations

1. **Rate limiting**: Add simple IP-based throttle in PHP if needed
2. **SPAM prevention**: Check for suspicious patterns (multiple URLs, excessive newlines)
3. **Input sanitization**: Always use `htmlspecialchars()` and `strip_tags()`
4. **Email injection**: Validate email format strictly; sanitize headers
5. **CSRF**: Optional: implement CSRF token validation
6. **No sensitive data**: Never store passwords, tokens, or payment info

## Troubleshooting

### Email not sending
- Check mail function enabled in PHP: `php.ini` should have `mail.function` enabled
- Verify recipient email is correct
- Check server error logs in CPanel > Error Logs
- Test with `error_log()` in PHP handler

### Validation not working
- Check that JavaScript file loads (F12 Console > Network tab)
- Verify form has `data-form-handler` attribute
- Check browser console for JS errors
- Ensure input `name` attributes match PHP handler expectations

### CORS issues (if handler on different domain)
- Add CORS headers to PHP handler:
  ```php
  header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
  header('Content-Type: application/json');
  ```

### Form appears to freeze
- Check network request in DevTools (F12 > Network)
- Verify `form-handler.php` URL is correct and file exists
- Check if handler returns valid JSON

## Examples

See `examples/` folder:
- `basic-form.html` — Minimal working form
- `usage.md` — Step-by-step implementation guide

## Files included

```
form-email-submission/
├── SKILL.md (this file)
├── backend/
│   └── form-handler.php (PHP email handler)
├── frontend/
│   └── form-validator.js (Client validation)
└── examples/
    ├── basic-form.html
    └── usage.md
```

---

**Next steps**: Ask Codex to add form submission to a specific page, provide the form fields list, and specify the recipient email.
