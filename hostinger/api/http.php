<?php
/**
 * Utilidades de entrada y salida: respuestas JSON, lectura del cuerpo de la
 * petición, lectura del token y CORS.
 */

declare(strict_types=1);

/** Responde en JSON y termina. */
function send_json($payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    // Sin caché en ningún sitio: la disponibilidad cambia con cada cita nueva,
    // y el panel debe ver siempre el último estado.
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Responde un error con forma estable: { "error": "..." }. */
function send_error(string $message, int $status = 400, array $extra = []): void
{
    send_json(array_merge(['error' => $message], $extra), $status);
}

/**
 * Cuerpo de la petición ya decodificado.
 *
 * Devuelve array vacío si no viene nada; falla con 400 si viene algo que no es
 * JSON válido, porque eso siempre es un error de quien llama.
 */
function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        send_error('El cuerpo de la petición no es JSON válido.', 400);
    }
    return $decoded;
}

/**
 * Token que trae la petición.
 *
 * Apache en hosting compartido a veces se come la cabecera `Authorization`
 * antes de que PHP la vea. El .htaccess que acompaña a este archivo la vuelve a
 * poner, pero por si acaso también se acepta `X-Api-Token`.
 */
function presented_token(): ?string
{
    $headers = [];
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            $headers[strtolower($name)] = $value;
        }
    }

    $candidates = [
        $headers['authorization'] ?? null,
        $_SERVER['HTTP_AUTHORIZATION'] ?? null,
        $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null,
    ];
    foreach ($candidates as $value) {
        if (is_string($value) && stripos($value, 'Bearer ') === 0) {
            return trim(substr($value, 7));
        }
    }

    $fallback = $headers['x-api-token'] ?? ($_SERVER['HTTP_X_API_TOKEN'] ?? null);
    return is_string($fallback) && $fallback !== '' ? trim($fallback) : null;
}

/** Cabeceras CORS, sólo para los orígenes declarados en config.php. */
function apply_cors(array $config): void
{
    $allowed = $config['allowed_origins'] ?? [];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Api-Token');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 600');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
