<?php
/**
 * AJAX handler for the main-page fulfillment request form.
 * Sends validated submissions to the configured recipient through PHP mail().
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'form-error-method');
}

$recipientEmail = 'info@expaforce.com';
$maxAttempts = 5;
$timeWindow = 3600;

try {
    $data = readRequestData();

    if (!empty($data['website'])) {
        respond(200, true, 'form-success-submit');
    }

    if (!checkRateLimit($maxAttempts, $timeWindow)) {
        respond(429, false, 'form-error-rate-limit');
    }

    $errors = validateSubmission($data);

    if (!empty($errors)) {
        respond(422, false, 'form-error-fix-fields', $errors);
    }

    $submission = [
        'full_name' => cleanText($data['full_name'] ?? '', 120),
        'phone' => cleanText($data['phone'] ?? '', 120),
        'product_context' => cleanMultilineText($data['product_context'] ?? '', 2000),
        'page_url' => cleanText($data['page_url'] ?? '', 500),
        'page_title' => cleanText($data['page_title'] ?? '', 200),
        'submitted_at' => cleanText($data['submitted_at'] ?? '', 80),
    ];

    sendSubmissionEmail($recipientEmail, $submission);
    logSubmission($submission);

    respond(200, true, 'form-success-submit');
} catch (Throwable $exception) {
    error_log('[form-handler] ' . $exception->getMessage());
    respond(500, false, 'form-error-submit');
}

function readRequestData(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (stripos($contentType, 'application/json') !== false) {
        $rawBody = file_get_contents('php://input') ?: '';
        $decoded = json_decode($rawBody, true);

        if (!is_array($decoded)) {
            respond(400, false, 'form-error-submit');
        }

        return $decoded;
    }

    return $_POST;
}

function validateSubmission(array $data): array
{
    $errors = [];

    $fullName = trim((string)($data['full_name'] ?? ''));
    $contact = trim((string)($data['phone'] ?? ''));
    $productContext = trim((string)($data['product_context'] ?? ''));

    if ($fullName === '') {
        $errors['full_name'] = 'form-error-required';
    } elseif (textLength($fullName) < 2 || textLength($fullName) > 120 || !preg_match('/\p{L}/u', $fullName)) {
        $errors['full_name'] = 'form-error-name';
    }

    if ($contact === '') {
        $errors['phone'] = 'form-error-required';
    } elseif (!isValidPhoneOrEmail($contact)) {
        $errors['phone'] = 'form-error-phone';
    }

    if ($productContext === '') {
        $errors['product_context'] = 'form-error-required';
    } elseif (textLength($productContext) < 10) {
        $errors['product_context'] = 'form-error-min-length';
    } elseif (textLength($productContext) > 2000) {
        $errors['product_context'] = 'form-error-max-length';
    } elseif (looksLikeSpam($productContext)) {
        $errors['product_context'] = 'form-error-spam';
    }

    if (!isConsentAccepted($data['consent'] ?? null)) {
        $errors['consent'] = 'form-error-consent';
    }

    return $errors;
}

function isValidPhoneOrEmail(string $value): bool
{
    if (strpos($value, '@') !== false) {
        return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
    }

    $normalized = preg_replace('/[\s\-\(\)]/', '', $value) ?? '';
    $digits = preg_replace('/\D/', '', $normalized) ?? '';

    return preg_match('/^\+?\d+$/', $normalized) === 1
        && strlen($digits) >= 7
        && strlen($digits) <= 20;
}

function isConsentAccepted($value): bool
{
    if (is_bool($value)) {
        return $value;
    }

    return in_array(strtolower((string)$value), ['1', 'on', 'true', 'yes'], true);
}

function looksLikeSpam(string $text): bool
{
    $urlCount = preg_match_all('/https?:\/\//i', $text);
    $newlineCount = substr_count($text, "\n");

    return $urlCount > 2 || $newlineCount > 12;
}

function cleanText(string $value, int $maxLength): string
{
    $value = strip_tags(trim($value));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', ' ', $value) ?? '';
    $value = preg_replace('/\s+/u', ' ', $value) ?? '';

    return utf8Substring($value, $maxLength);
}

function cleanMultilineText(string $value, int $maxLength): string
{
    $value = strip_tags(trim($value));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', ' ', $value) ?? '';
    $value = preg_replace("/[ \t]+/u", ' ', $value) ?? '';

    return utf8Substring($value, $maxLength);
}

function textLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    if (preg_match_all('/./us', $value, $matches) !== false) {
        return count($matches[0]);
    }

    return strlen($value);
}

function utf8Substring(string $value, int $maxLength): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    if (textLength($value) <= $maxLength) {
        return $value;
    }

    if (preg_match_all('/./us', $value, $matches) !== false) {
        return implode('', array_slice($matches[0], 0, $maxLength));
    }

    return substr($value, 0, $maxLength);
}

function sendSubmissionEmail(string $recipientEmail, array $submission): void
{
    if (filter_var($recipientEmail, FILTER_VALIDATE_EMAIL) === false) {
        throw new RuntimeException('Invalid recipient email.');
    }

    $host = getMailHost();
    $subject = encodeMailHeader('Новая заявка на фулфилмент EXPAFORCE');
    $boundary = 'expaforce-' . bin2hex(random_bytes(16));
    $body = buildMultipartEmailBody($submission, $boundary);
    $headers = [
        'From: EXPAFORCE <noreply@' . $host . '>',
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'X-Mailer: PHP/' . phpversion(),
    ];

    if (strpos($submission['phone'], '@') !== false && filter_var($submission['phone'], FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $submission['phone'];
    }

    if (!mail($recipientEmail, $subject, $body, implode("\r\n", $headers))) {
        throw new RuntimeException('mail() returned false.');
    }
}

function buildMultipartEmailBody(array $submission, string $boundary): string
{
    $plainTextBody = buildPlainTextEmailBody($submission);
    $htmlBody = buildHtmlEmailBody($submission);

    return implode("\r\n", [
        '--' . $boundary,
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        $plainTextBody,
        '',
        '--' . $boundary,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        $htmlBody,
        '',
        '--' . $boundary . '--',
        '',
    ]);
}

function buildPlainTextEmailBody(array $submission): string
{
    $lines = [
        'Новая заявка на фулфилмент',
        '',
        'Имя: ' . $submission['full_name'],
        'Контакт: ' . $submission['phone'],
        '',
        'Что нужно обработать:',
        $submission['product_context'],
        '',
        'Данные отправки:',
        'Страница: ' . ($submission['page_title'] ?: 'неизвестно'),
        'URL: ' . ($submission['page_url'] ?: 'неизвестно'),
        'Дата отправки: ' . ($submission['submitted_at'] ?: gmdate('c')),
        'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'неизвестно'),
        'Браузер: ' . cleanText($_SERVER['HTTP_USER_AGENT'] ?? 'неизвестно', 300),
    ];

    return implode("\n", $lines);
}

function buildHtmlEmailBody(array $submission): string
{
    $baseUrl = getBaseUrl();
    $logoUrl = $baseUrl . '/src/graphics/svg/logo-white.svg';
    $pageTitle = $submission['page_title'] ?: 'Неизвестная страница';
    $pageUrl = $submission['page_url'] ?: '';
    $submittedAt = $submission['submitted_at'] ?: gmdate('c');
    $userAgent = cleanText($_SERVER['HTTP_USER_AGENT'] ?? 'неизвестно', 300);
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'неизвестно';

    $pageLink = $pageUrl !== ''
        ? '<a href="' . escapeHtml($pageUrl) . '" style="color:#197437;text-decoration:none;">' . escapeHtml($pageTitle) . '</a>'
        : escapeHtml($pageTitle);

    return '<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Новая заявка на фулфилмент</title>
</head>
<body style="margin:0;padding:0;background:#f7faf3;color:#06291c;font-family:Segoe UI,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;background:#f7faf3;margin:0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:680px;background:#ffffff;border:1px solid rgba(1,63,40,0.14);border-radius:18px;overflow:hidden;box-shadow:0 18px 40px rgba(1,63,40,0.09);">
          <tr>
            <td style="background:#013f28;padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="' . escapeHtml($logoUrl) . '" width="152" alt="EXPAFORCE" style="display:block;width:152px;max-width:100%;height:auto;border:0;">
                  </td>
                  <td align="right" style="vertical-align:middle;color:#dbeed2;font-size:13px;font-weight:600;letter-spacing:0;text-transform:uppercase;">
                    Заявка с сайта
                  </td>
                </tr>
              </table>
              <h1 style="margin:26px 0 10px;color:#ffffff;font-size:28px;line-height:1.2;font-weight:700;">Новая заявка на фулфилмент</h1>
              <p style="margin:0;color:#dbeed2;font-size:15px;line-height:1.6;">Посетитель отправил форму EXPAFORCE. Проверьте детали ниже и свяжитесь с клиентом по указанному контакту.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 32px 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;border-collapse:separate;border-spacing:0 12px;">
                ' . buildEmailFieldRow('Имя', $submission['full_name']) . '
                ' . buildEmailFieldRow('Контакт', $submission['phone']) . '
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <div style="background:#eef6ea;border:1px solid rgba(1,63,40,0.14);border-radius:14px;padding:22px 24px;">
                <p style="margin:0 0 10px;color:#197437;font-size:13px;font-weight:700;text-transform:uppercase;">Что нужно обработать</p>
                <p style="margin:0;color:#06291c;font-size:16px;line-height:1.65;">' . nl2br(escapeHtml($submission['product_context'])) . '</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;background:#f7faf3;border:1px solid rgba(1,63,40,0.10);border-radius:14px;padding:18px 20px;">
                <tr>
                  <td colspan="2" style="padding:0 0 12px;color:#013f28;font-size:14px;font-weight:700;">Данные отправки</td>
                </tr>
                ' . buildEmailMetaRow('Страница', $pageLink, true) . '
                ' . buildEmailMetaRow('Дата отправки', escapeHtml($submittedAt), true) . '
                ' . buildEmailMetaRow('IP', escapeHtml($ipAddress), true) . '
                ' . buildEmailMetaRow('Браузер', escapeHtml($userAgent), true) . '
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#e7f4df;padding:18px 32px;color:#06291c;font-size:13px;line-height:1.5;">
              Отправлено с формы сайта <strong style="color:#013f28;">EXPAFORCE</strong>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}

function buildEmailFieldRow(string $label, string $value): string
{
    return '<tr>
      <td style="width:150px;padding:15px 18px;background:#f7faf3;border:1px solid rgba(1,63,40,0.10);border-right:0;border-radius:12px 0 0 12px;color:#197437;font-size:13px;font-weight:700;text-transform:uppercase;vertical-align:top;">' . escapeHtml($label) . '</td>
      <td style="padding:15px 18px;background:#f7faf3;border:1px solid rgba(1,63,40,0.10);border-left:0;border-radius:0 12px 12px 0;color:#06291c;font-size:16px;line-height:1.5;font-weight:600;vertical-align:top;">' . escapeHtml($value) . '</td>
    </tr>';
}

function buildEmailMetaRow(string $label, string $value, bool $valueContainsHtml = false): string
{
    $safeValue = $valueContainsHtml ? $value : escapeHtml($value);

    return '<tr>
      <td style="width:130px;padding:6px 0;color:rgba(6,41,28,0.64);font-size:13px;line-height:1.5;vertical-align:top;">' . escapeHtml($label) . '</td>
      <td style="padding:6px 0;color:#06291c;font-size:13px;line-height:1.5;vertical-align:top;">' . $safeValue . '</td>
    </tr>';
}

function getMailHost(): string
{
    $host = $_SERVER['SERVER_NAME'] ?? ($_SERVER['HTTP_HOST'] ?? 'expaforce.com');
    $host = strtolower((string)$host);
    $host = preg_replace('/:\d+$/', '', $host) ?? 'expaforce.com';
    $host = preg_replace('/[^a-z0-9.-]/', '', $host) ?? 'expaforce.com';

    return $host ?: 'expaforce.com';
}

function getBaseUrl(): string
{
    $host = getMailHost();
    $scheme = 'http';

    if (
        (!empty($_SERVER['HTTPS']) && strtolower((string)$_SERVER['HTTPS']) !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
    ) {
        $scheme = 'https';
    }

    return $scheme . '://' . $host;
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function encodeMailHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function checkRateLimit(int $maxAttempts, int $timeWindow): bool
{
    $remoteAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $cacheFile = sys_get_temp_dir() . '/expaforce_form_' . md5($remoteAddress) . '.json';
    $now = time();
    $attempts = [];

    if (is_file($cacheFile)) {
        $stored = json_decode((string)file_get_contents($cacheFile), true);
        if (is_array($stored)) {
            $attempts = array_filter($stored, static fn($timestamp) => $now - (int)$timestamp < $timeWindow);
        }
    }

    if (count($attempts) >= $maxAttempts) {
        return false;
    }

    $attempts[] = $now;
    file_put_contents($cacheFile, json_encode(array_values($attempts)));

    return true;
}

function logSubmission(array $submission): void
{
    $logFile = sys_get_temp_dir() . '/expaforce_form_submissions.log';
    $entry = implode(' | ', [
        gmdate('c'),
        $submission['full_name'],
        $submission['phone'],
        $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    ]);

    file_put_contents($logFile, $entry . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function respond(int $status, bool $success, string $messageKey, array $errors = []): void
{
    http_response_code($status);
    echo json_encode(
        [
            'success' => $success,
            'message_key' => $messageKey,
            'errors' => $errors,
        ],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}
