# Form Email Submission Skill

**Created**: May 15, 2026
**Version**: 1.0
**Target**: EXPOForce CPanel PHP hosting

## What's included

```
form-email-submission/
├── SKILL.md                          # Full documentation (read first!)
├── backend/
│   └── form-handler.php              # PHP email handler (CPanel compatible)
├── frontend/
│   └── form-validator.js             # Client-side validation & AJAX
└── examples/
    ├── basic-form.html               # Working example form
    └── usage.md                      # Step-by-step implementation guide
```

## Quick Setup (3 steps)

### 1. Copy files to project
- `form-handler.php` → project root or `/scripts/`
- `form-validator.js` → `/scripts/`

### 2. Update email in form-handler.php
```php
$recipient_email = 'info@expaforce.com';
```

### 3. Add form + script to page
```html
<form id="contact-form" data-form-handler="/form-handler.php">
  <div class="form-field">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
    <span class="form-error"></span>
  </div>
  
  <!-- ... more fields ... -->
  
  <button type="submit">Send</button>
  <span class="form-status"></span>
</form>

<script src="/scripts/form-validator.js"></script>
```

Done! Form now validates on client + sends email via PHP.

## Features

✅ Client-side validation (email, phone, required)  
✅ Server-side validation (PHP)  
✅ Email submission via PHP mail()  
✅ CPanel Hayhost compatible  
✅ Rate limiting (anti-spam)  
✅ i18n support (multilingual)  
✅ Responsive error handling  
✅ AJAX submission (no page reload)  

## Configuration

| Setting | Location | Default |
|---------|----------|---------|
| Recipient email | form-handler.php | `info@expaforce.com` |
| Form selector | HTML | `[data-form-handler]` |
| Handler URL | HTML form attribute | `/form-handler.php` |
| Rate limit | form-handler.php | 5 requests/hour/IP |
| Min message length | form-validator.js | 10 chars |

## For Codex usage

**Ask Codex to:**
1. "Add form submission to the main page CTA section"
2. "Set email fields: name, email, phone, message"
3. "Email should go to: info@expaforce.com"
4. "Add client validation (email, phone formats)"

**Codex will:**
- Use this skill to understand the system
- Add form HTML to the page
- Copy PHP handler to appropriate location
- Include form-validator.js
- Add necessary CSS classes
- Test submission flow

## Next Step

Read [SKILL.md](./SKILL.md) for full documentation, then ask Codex to add form submission to your site!
