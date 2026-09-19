<?php
/**
 * Ray Media - Contact Form PHP Mail Handler with Web3Forms & Local Backup
 */

// =========================================================================
// 1. CONFIGURATION
// =========================================================================

// Set your receiving email address here
$to_email = "vinithkumar78878@gmail.com"; 

// Set Email Subject Prefix
$subject_prefix = "New Contact Inquiry - Ray Media Website";

// Web3Forms API Key Backup (Guarantees Instant Inbox Delivery)
$web3forms_key = "979298a1-7508-4d97-ab34-3d8ffda5e985";

// =========================================================================
// 2. PROCESS FORM SUBMISSION
// =========================================================================

// Suppress PHP errors from cluttering JSON response
error_reporting(0);
ini_set('display_errors', 0);

// Set response headers for JSON and CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
    exit;
}

// Get input data (Handles both JSON payload and standard Form POST)
$raw_input = file_get_contents('php://input');
$json_data = json_decode($raw_input, true);

if (is_array($json_data) && !empty($json_data)) {
    $input = $json_data;
} else {
    $input = $_POST;
}

// Extract and sanitize form fields
$name    = isset($input['name'])    ? trim(strip_tags($input['name']))    : '';
$phone   = isset($input['phone'])   ? trim(strip_tags($input['phone']))   : '';
$email   = isset($input['email'])   ? trim(strip_tags($input['email']))   : '';
$service = isset($input['service']) ? trim(strip_tags($input['service'])) : '';
$message = isset($input['message']) ? trim(strip_tags($input['message'])) : '';

// Remove newlines from single-line fields to prevent header injection
$name    = str_replace(["\r", "\n"], '', $name);
$email   = str_replace(["\r", "\n"], '', $email);
$phone   = str_replace(["\r", "\n"], '', $phone);
$service = str_replace(["\r", "\n"], '', $service);

// =========================================================================
// 3. VALIDATION
// =========================================================================

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your name.']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your phone number.']);
    exit;
}

if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your message.']);
    exit;
}

// =========================================================================
// 4. PREPARE EMAIL CONTENT
// =========================================================================

$domain_name = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'raymedia.in';
$is_localhost = in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1', '::1']);
$subject     = $subject_prefix . ($service ? " ($service)" : "");

// Clean Domain for Sender Header
$clean_domain = str_replace(['http://', 'https://', 'www.'], '', $domain_name);
$sender_email = "leads@" . $clean_domain;

// HTML Email Body
$html_content = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>' . htmlspecialchars($subject) . '</title>
    <style>
        body { font-family: "Segoe UI", Arial, sans-serif; background-color: #0f0c1b; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #19142e; border: 1px solid #2e2652; border-radius: 12px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ffb703; }
        .header h1 { color: #ffffff; font-size: 24px; margin: 0 0 5px 0; }
        .header p { color: #ffb703; font-weight: bold; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 20px 0; }
        .field-group { margin-bottom: 15px; padding: 12px 15px; background: #231c40; border-radius: 8px; border-left: 4px solid #ffb703; }
        .field-label { font-size: 12px; color: #a097c6; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; }
        .field-value { font-size: 16px; color: #ffffff; margin-top: 4px; word-break: break-word; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #2e2652; font-size: 12px; color: #7a70a5; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ray Media</h1>
            <p>New Website Contact Lead</p>
        </div>
        <div class="content">
            <div class="field-group">
                <div class="field-label">Full Name</div>
                <div class="field-value">' . htmlspecialchars($name) . '</div>
            </div>
            <div class="field-group">
                <div class="field-label">Email Address</div>
                <div class="field-value"><a href="mailto:' . htmlspecialchars($email) . '" style="color: #ffb703; text-decoration: none;">' . htmlspecialchars($email) . '</a></div>
            </div>
            <div class="field-group">
                <div class="field-label">Phone Number</div>
                <div class="field-value"><a href="tel:' . htmlspecialchars($phone) . '" style="color: #ffffff; text-decoration: none;">' . htmlspecialchars($phone) . '</a></div>
            </div>
            <div class="field-group">
                <div class="field-label">Selected Service</div>
                <div class="field-value">' . htmlspecialchars($service ? $service : 'Not Specified') . '</div>
            </div>
            <div class="field-group">
                <div class="field-label">Message</div>
                <div class="field-value">' . nl2br(htmlspecialchars($message)) . '</div>
            </div>
        </div>
        <div class="footer">
            Submitted on ' . date('Y-m-d H:i:s T') . ' via ' . htmlspecialchars($domain_name) . '
        </div>
    </div>
</body>
</html>
';

// =========================================================================
// 5. PROCESS DUAL DELIVERY: LOCAL LOG + PHP MAIL + WEB3FORMS API BACKUP
// =========================================================================

// 1. Always log lead locally on server inside leads_log.txt
$log_entry = "==================================================\n";
$log_entry .= "Date: " . date('Y-m-d H:i:s') . "\n";
$log_entry .= "Name: " . $name . "\n";
$log_entry .= "Email: " . $email . "\n";
$log_entry .= "Phone: " . $phone . "\n";
$log_entry .= "Service: " . $service . "\n";
$log_entry .= "Message: " . $message . "\n";
$log_entry .= "==================================================\n\n";

@file_put_contents(__DIR__ . '/leads_log.txt', $log_entry, FILE_APPEND);

// 2. Try PHP mail() with Hostinger parameters
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Ray Media Website <" . $sender_email . ">\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

ini_set('sendmail_from', $sender_email);
$mail_sent = @mail($to_email, $subject, $html_content, $headers, "-f" . $sender_email);

// 3. Web3Forms API Forwarding Backup (Guarantees Instant Inbox Delivery)
if (!empty($web3forms_key)) {
    $web3_payload = [
        'access_key' => $web3forms_key,
        'subject'    => $subject,
        'from_name'  => 'Ray Media Website',
        'name'       => $name,
        'email'      => $email,
        'phone'      => $phone,
        'service'    => $service,
        'message'    => $message
    ];

    $ch = curl_init('https://api.web3forms.com/submit');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($web3_payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $web3_res = curl_exec($ch);
    curl_close($ch);
}

echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your message has been sent successfully. We will get back to you soon.'
]);