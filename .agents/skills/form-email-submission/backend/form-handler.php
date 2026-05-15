<?php
/**
 * Form Email Submission Handler
 * 
 * Receives form data via AJAX, validates on server, sends via mail()
 * Returns JSON response
 * 
 * Place this file in root directory or /scripts/ folder
 * Update $recipient_email to match your domain
 */

// Allow CORS for AJAX
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

/**
 * CONFIGURATION
 */
$recipient_email = 'info@expaforce.com';  // Change to your email
$site_url = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'unknown';
$max_attempts = 5;  // Max submissions per IP in time window
$time_window = 3600;  // Time window in seconds (1 hour)


/**
 * SIMPLE RATE LIMITING (Optional)
 * Prevent same IP from spamming multiple submissions
 */
function checkRateLimit($max_attempts = 5, $time_window = 3600) {
    $cache_file = sys_get_temp_dir() . '/form_submissions_' . md5($_SERVER['REMOTE_ADDR']) . '.txt';
    
    if (file_exists($cache_file)) {
        $data = json_decode(file_get_contents($cache_file), true);
        $current_time = time();
        
        // Clean old entries
        $data = array_filter($data, function($timestamp) use ($current_time, $time_window) {
            return $current_time - $timestamp < $time_window;
        });
        
        if (count($data) >= $max_attempts) {
            return false;  // Rate limit exceeded
        }
        
        $data[] = time();
    } else {
        $data = [time()];
    }
    
    file_put_contents($cache_file, json_encode($data));
    return true;
}


/**
 * INPUT VALIDATION
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validatePhone($phone) {
    // Remove common separators, keep only digits and +
    $cleaned = preg_replace('/[^0-9+\-\(\)\s]/', '', $phone);
    // Must have at least 7 digits
    $digits = preg_replace('/[^0-9]/', '', $cleaned);
    return strlen($digits) >= 7;
}

function sanitizeInput($input) {
    // Remove tags, trim, escape
    $input = strip_tags(trim($input));
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

function checkSpam($text) {
    // Check for multiple URLs (common spam)
    $url_count = preg_match_all('/https?:\/\//', $text);
    if ($url_count > 2) {
        return true;
    }
    
    // Check for excessive newlines
    $newline_count = substr_count($text, "\n");
    if ($newline_count > 10) {
        return true;
    }
    
    return false;
}


/**
 * MAIN HANDLER
 */
try {
    // Rate limit check
    if (!checkRateLimit($max_attempts, $time_window)) {
        http_response_code(429);
        throw new Exception('Too many requests. Please try again later.');
    }
    
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    // Required fields
    $required_fields = ['full_name', 'company', 'phone', 'product_context', 'consent'];
    $errors = [];
    
    // Validate required fields
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            $errors[$field] = 'This field is required';
        }
    }
    
    // Validate phone/email format (phone field can be email or phone)
    if (!empty($data['phone'])) {
        $phone_value = $data['phone'];
        // Check if it looks like an email
        if (strpos($phone_value, '@') !== false) {
            if (!validateEmail($phone_value)) {
                $errors['phone'] = 'Invalid email format';
            }
        } else {
            // Treat as phone
            if (!validatePhone($phone_value)) {
                $errors['phone'] = 'Invalid phone or email format';
            }
        }
    }
    
    // Validate consent checkbox
    if (empty($data['consent'])) {
        $errors['consent'] = 'You must agree to data processing';
    }
    
    // Check for spam
    if (!empty($data['message']) && checkSpam($data['message'])) {
        $errors['message'] = 'Message appears to contain spam';
    }
    
    // Return validation errors if any
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors
        ]);
        exit;
    }
    
    // Sanitize inputs
    $full_name = sanitizeInput($data['full_name'] ?? '');
    $company = sanitizeInput($data['company'] ?? '');
    $phone = sanitizeInput($data['phone'] ?? '');
    $product_context = sanitizeInput($data['product_context'] ?? '');
    
    // Build email
    $subject = 'New fulfillment inquiry from ' . $site_url;
    
    $body = "New fulfillment inquiry:\n\n";
    $body .= "Name: " . $full_name . "\n";
    $body .= "Company: " . $company . "\n";
    $body .= "Contact: " . $phone . "\n";
    $body .= "\n--- What to process ---\n";
    $body .= $product_context . "\n";
    $body .= "\n--- Metadata ---\n";
    $body .= "Sent from: " . $site_url . "\n";
    $body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $body .= "User Agent: " . substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 100) . "\n";
    $body .= "Date: " . date('Y-m-d H:i:s') . "\n";
    
    // Set email headers
    $headers = "From: " . $full_name . " <noreply@" . $site_url . ">\r\n";
    
    // Add reply-to if phone looks like email
    if (strpos($phone, '@') !== false) {
        $headers .= "Reply-To: " . $phone . "\r\n";
    }
    
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email
    $mail_sent = mail($recipient_email, $subject, $body, $headers);
    
    if (!$mail_sent) {
        throw new Exception('Failed to send email. Please try again later.');
    }
    
    // Optional: Log submission
    logSubmission($full_name, $company, $phone);
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully.'
    ]);
    exit;
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit;
}


/**
 * OPTIONAL: Log submissions to file (for reference)
 */
function logSubmission($full_name, $company, $phone) {
    $log_file = sys_get_temp_dir() . '/form_submissions.log';
    $log_entry = date('Y-m-d H:i:s') . " | " . $full_name . " | " . $company . " | " . $phone . " | " . $_SERVER['REMOTE_ADDR'] . "\n";
    file_put_contents($log_file, $log_entry, FILE_APPEND);
}
?>
