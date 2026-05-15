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

$recipientEmail = 'it@armbiz.am';
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
    $subject = 'New fulfillment request from EXPAFORCE';
    $body = buildEmailBody($submission);
    $headers = [
        'From: EXPAFORCE Website <noreply@' . $host . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion(),
    ];

    if (strpos($submission['phone'], '@') !== false && filter_var($submission['phone'], FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $submission['phone'];
    }

    if (!mail($recipientEmail, $subject, $body, implode("\r\n", $headers))) {
        throw new RuntimeException('mail() returned false.');
    }
}

function buildEmailBody(array $submission): string
{
    $lines = [
        'New fulfillment request',
        '',
        'Name: ' . $submission['full_name'],
        'Contact: ' . $submission['phone'],
        '',
        'What needs to be handled:',
        $submission['product_context'],
        '',
        'Metadata:',
        'Page: ' . ($submission['page_title'] ?: 'unknown'),
        'URL: ' . ($submission['page_url'] ?: 'unknown'),
        'Submitted at: ' . ($submission['submitted_at'] ?: gmdate('c')),
        'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
        'User agent: ' . cleanText($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 300),
    ];

    return implode("\n", $lines);
}

function getMailHost(): string
{
    $host = $_SERVER['SERVER_NAME'] ?? ($_SERVER['HTTP_HOST'] ?? 'expaforce.com');
    $host = strtolower((string)$host);
    $host = preg_replace('/:\d+$/', '', $host) ?? 'expaforce.com';
    $host = preg_replace('/[^a-z0-9.-]/', '', $host) ?? 'expaforce.com';

    return $host ?: 'expaforce.com';
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
