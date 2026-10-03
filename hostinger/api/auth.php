<?php
/**
 * Sesión del panel y freno a la fuerza bruta.
 *
 * El panel es una página estática que habla directamente con esta API desde el
 * navegador, así que el usuario y la contraseña se comprueban aquí y no en otro
 * servidor.
 *
 * Al entrar se entrega un token de sesión aleatorio que el navegador manda en
 * la cabecera `Authorization`. No se usan cookies a propósito: con una cabecera
 * no hay ataques CSRF posibles (otra web no puede añadirla a una petición), y
 * funciona igual si el sitio y la API viven en dominios distintos.
 *
 * En la base de datos se guarda el hash del token, nunca el token: quien lea la
 * tabla no puede usar lo que encuentre.
 */

declare(strict_types=1);

const SESSION_HOURS = 8;
const LOGIN_MAX_FAILURES = 8;
const LOGIN_WINDOW_MINUTES = 15;
const MIN_ADMIN_PASSWORD_LENGTH = 8;

/**
 * Crea las tablas de sesiones y de intentos si todavía no existen.
 *
 * Se hace aquí y no sólo en schema.sql para que una instalación que ya estaba
 * funcionando no tenga que volver a pasar por phpMyAdmin al actualizarse.
 */
function ensure_auth_tables(PDO $pdo): void
{
    static $ready = false;
    if ($ready) {
        return;
    }

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS admin_sessions (
            token_hash CHAR(64)  NOT NULL,
            expires_at DATETIME  NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (token_hash),
            KEY idx_expires (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS request_attempts (
            id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
            kind         VARCHAR(20)  NOT NULL,
            client_key   CHAR(64)     NOT NULL,
            attempted_at DATETIME     NOT NULL,
            PRIMARY KEY (id),
            KEY idx_lookup (kind, client_key, attempted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $ready = true;
}

/**
 * Identificador de quien llama, para contar intentos.
 *
 * Sólo REMOTE_ADDR: X-Forwarded-For lo escribe el propio cliente y bastaría con
 * cambiarlo en cada intento para saltarse el límite. Se guarda con hash para no
 * almacenar direcciones IP en claro.
 */
function client_key(): string
{
    return hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'desconocido'));
}

function count_recent_attempts(PDO $pdo, string $kind, int $minutes): int
{
    ensure_auth_tables($pdo);
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM request_attempts
          WHERE kind = ? AND client_key = ? AND attempted_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)'
    );
    $stmt->execute([$kind, client_key(), $minutes]);
    return (int) $stmt->fetchColumn();
}

function record_attempt(PDO $pdo, string $kind): void
{
    ensure_auth_tables($pdo);
    $pdo->prepare('INSERT INTO request_attempts (kind, client_key, attempted_at) VALUES (?, ?, NOW())')
        ->execute([$kind, client_key()]);
    // Limpieza de paso: nada de aquí sirve pasado un día.
    $pdo->exec('DELETE FROM request_attempts WHERE attempted_at < DATE_SUB(NOW(), INTERVAL 1 DAY)');
}

function clear_attempts(PDO $pdo, string $kind): void
{
    ensure_auth_tables($pdo);
    $pdo->prepare('DELETE FROM request_attempts WHERE kind = ? AND client_key = ?')
        ->execute([$kind, client_key()]);
}

/** Usuario del panel, o cadena vacía si no está configurado. */
function admin_user(array $config): string
{
    $user = (string) ($config['admin_user'] ?? '');
    return $user === 'AQUI_EL_USUARIO_DEL_PANEL' ? '' : $user;
}

/** Contraseña del panel, o cadena vacía si no está configurada o es demasiado corta. */
function admin_password(array $config): string
{
    $password = (string) ($config['admin_password'] ?? '');
    if ($password === 'AQUI_LA_CONTRASENA_DEL_PANEL') {
        return '';
    }
    return strlen($password) >= MIN_ADMIN_PASSWORD_LENGTH ? $password : '';
}

function is_panel_configured(array $config): bool
{
    return admin_user($config) !== '' && admin_password($config) !== '';
}

/** El token de servidor de config.php, si está configurado. */
function server_token(array $config): string
{
    $token = (string) ($config['api_token'] ?? '');
    return $token === 'AQUI_UN_TOKEN_LARGO_Y_ALEATORIO' ? '' : $token;
}

/**
 * La petición viene autorizada.
 *
 * Vale el token de servidor de config.php (scripts, pruebas) o una sesión del
 * panel vigente.
 */
function is_authorized(PDO $pdo, array $config): bool
{
    $presented = presented_token();
    if ($presented === null || $presented === '') {
        return false;
    }

    $serverToken = server_token($config);
    if ($serverToken !== '' && hash_equals($serverToken, $presented)) {
        return true;
    }

    ensure_auth_tables($pdo);
    $stmt = $pdo->prepare('SELECT 1 FROM admin_sessions WHERE token_hash = ? AND expires_at > NOW()');
    $stmt->execute([hash('sha256', $presented)]);
    return $stmt->fetchColumn() !== false;
}

function require_auth(PDO $pdo, array $config): void
{
    if (!is_authorized($pdo, $config)) {
        send_error('No autorizado. Vuelve a entrar al panel.', 401);
    }
}

/** POST /login  { "usuario": "...", "password": "..." }  ->  { "token": "...", "expiresInSeconds": n } */
function handle_login(PDO $pdo, array $config): void
{
    $expectedUser = admin_user($config);
    $expectedPassword = admin_password($config);
    if ($expectedUser === '' || $expectedPassword === '') {
        send_error(
            'El panel no está configurado: falta admin_user o admin_password en config.php (contraseña de mínimo '
                . MIN_ADMIN_PASSWORD_LENGTH . ' caracteres).',
            503
        );
    }

    if (count_recent_attempts($pdo, 'login', LOGIN_WINDOW_MINUTES) >= LOGIN_MAX_FAILURES) {
        send_error('Demasiados intentos. Espera unos minutos y vuelve a probar.', 429);
    }

    $body = read_json_body();
    $user = $body['usuario'] ?? null;
    $password = $body['password'] ?? null;
    if (!is_string($user) || $user === '' || !is_string($password) || $password === '') {
        send_error('Escribe el usuario y la contraseña.', 422);
    }

    // Se comparan hashes y no las cadenas directamente: así las dos partes de
    // la comparación tienen siempre la misma longitud y hash_equals no deja
    // entrever la del usuario o la contraseña reales por temporización.
    $userOk = hash_equals(hash('sha256', $expectedUser), hash('sha256', $user));
    $passOk = hash_equals(hash('sha256', $expectedPassword), hash('sha256', $password));
    if (!$userOk || !$passOk) {
        record_attempt($pdo, 'login');
        send_error('Usuario o contraseña incorrectos.', 401);
    }

    clear_attempts($pdo, 'login');

    $token = bin2hex(random_bytes(32));
    $pdo->prepare(
        'INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, DATE_ADD(NOW(), INTERVAL ? HOUR))'
    )->execute([hash('sha256', $token), SESSION_HOURS]);
    $pdo->exec('DELETE FROM admin_sessions WHERE expires_at < NOW()');

    send_json(['token' => $token, 'expiresInSeconds' => SESSION_HOURS * 3600]);
}

/** POST /logout  — invalida la sesión con la que se llama. */
function handle_logout(PDO $pdo): void
{
    $presented = presented_token();
    if ($presented !== null && $presented !== '') {
        ensure_auth_tables($pdo);
        $pdo->prepare('DELETE FROM admin_sessions WHERE token_hash = ?')
            ->execute([hash('sha256', $presented)]);
    }
    send_json(['ok' => true]);
}

/** GET /session  — si la sesión que se presenta sigue viva. */
function handle_session(PDO $pdo, array $config): void
{
    send_json([
        'authenticated' => is_authorized($pdo, $config),
        'panelConfigured' => is_panel_configured($config),
    ]);
}
