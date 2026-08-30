<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Diese Anfrage ist nicht erlaubt.']);
}

$config = [
    'hostinger_api_token' => getenv('HOSTINGER_MAIL_API_TOKEN') ?: '',
    'mailbox_resource_id' => getenv('HOSTINGER_MAILBOX_RESOURCE_ID') ?: 'AC14e89991f85772775bfedb083504',
    'recipient_email' => getenv('CONTACT_RECIPIENT_EMAIL') ?: 'info@groweasy.at',
    'sender_name' => getenv('CONTACT_SENDER_NAME') ?: 'GROW easy Kontaktformular',
];

$localConfigPath = __DIR__ . '/contact-config.php';
if (is_file($localConfigPath)) {
    $localConfig = require $localConfigPath;
    if (is_array($localConfig)) {
        $config = array_merge($config, array_filter($localConfig, static fn($value) => $value !== null && $value !== ''));
    }
}

if (empty($config['hostinger_api_token'])) {
    respond(500, [
        'ok' => false,
        'message' => 'Der Mailversand ist serverseitig noch nicht konfiguriert.',
    ]);
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$website = trim((string)($_POST['website'] ?? ''));

if ($website !== '') {
    respond(200, ['ok' => true, 'message' => 'Danke, deine Nachricht wurde gesendet.']);
}

$allowedSubjects = ['Produkt Anfrage', 'Kundenservice', 'Sonstiges'];
if (!in_array($subject, $allowedSubjects, true)) {
    $subject = 'Sonstiges';
}

if ($name === '' || text_length($name) > 120) {
    respond(422, ['ok' => false, 'message' => 'Bitte gib deinen Namen ein.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || text_length($email) > 180) {
    respond(422, ['ok' => false, 'message' => 'Bitte gib eine gültige E-Mail-Adresse ein.']);
}

if ($message === '' || text_length($message) < 10 || text_length($message) > 5000) {
    respond(422, ['ok' => false, 'message' => 'Bitte schreib eine Nachricht mit mindestens 10 Zeichen.']);
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$mailSubject = 'GROW easy Kontakt: ' . $subject;
$plainText = "Neue Nachricht über groweasy.at\n\n"
    . "Name: {$name}\n"
    . "E-Mail: {$email}\n"
    . "Betreff: {$subject}\n\n"
    . "Nachricht:\n{$message}\n";

$html = <<<HTML
<h2>Neue Nachricht über groweasy.at</h2>
<p><strong>Name:</strong> {$safeName}</p>
<p><strong>E-Mail:</strong> <a href="mailto:{$safeEmail}">{$safeEmail}</a></p>
<p><strong>Betreff:</strong> {$safeSubject}</p>
<p><strong>Nachricht:</strong></p>
<p>{$safeMessage}</p>
HTML;

$payload = [
    'to' => [$config['recipient_email']],
    'displayName' => $config['sender_name'],
    'subject' => $mailSubject,
    'text' => $plainText,
    'html' => $html,
];

$endpoint = 'https://api.mail.hostinger.com/api/v1/mailboxes/'
    . rawurlencode((string)$config['mailbox_resource_id'])
    . '/send';

$jsonPayload = json_encode($payload, JSON_UNESCAPED_UNICODE);
if ($jsonPayload === false) {
    respond(500, ['ok' => false, 'message' => 'Die Nachricht konnte nicht vorbereitet werden.']);
}

$statusCode = 0;
$responseBody = false;
$transportError = '';

if (function_exists('curl_init')) {
    $ch = curl_init($endpoint);
    if ($ch === false) {
        respond(500, ['ok' => false, 'message' => 'Der Mailversand konnte nicht gestartet werden.']);
    }

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $config['hostinger_api_token'],
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_POSTFIELDS => $jsonPayload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
    ]);

    $responseBody = curl_exec($ch);
    $statusCode = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $transportError = curl_error($ch);
    curl_close($ch);
} else {
    $headers = [
        'Authorization: Bearer ' . $config['hostinger_api_token'],
        'Content-Type: application/json',
        'Accept: application/json',
    ];
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => $jsonPayload,
            'timeout' => 12,
            'ignore_errors' => true,
        ],
    ]);

    $responseBody = file_get_contents($endpoint, false, $context);
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $match)) {
        $statusCode = (int)$match[1];
    }
}

if ($responseBody === false || $transportError !== '') {
    respond(502, ['ok' => false, 'message' => 'Die Nachricht konnte gerade nicht gesendet werden.']);
}

if ($statusCode < 200 || $statusCode >= 300) {
    respond(502, ['ok' => false, 'message' => 'Die Mail-API hat die Nachricht nicht angenommen.']);
}

respond(200, ['ok' => true, 'message' => 'Danke, deine Nachricht wurde gesendet.']);
