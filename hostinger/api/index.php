<?php
/**
 * API del administrador de citas de la Dra. Lidia Chávez.
 *
 * Único punto de entrada. El sitio es estático, así que quien llama es el
 * navegador: la página /citas/ para pedir hora, y el panel /admin/ para
 * gestionar citas y horario con la sesión que obtiene en /login.
 *
 * Rutas públicas
 *   GET    /health
 *   GET    /horarios                horario semanal, días bloqueados y ajustes
 *   GET    /disponibilidad          ?desde=&hasta= -> huecos libres por día
 *   POST   /citas                   solicita una cita (queda "pendiente")
 *   POST   /login                   { usuario, password } -> { token }
 *   POST   /logout
 *   GET    /session
 *
 * Con sesión del panel (o con el api_token de config.php)
 *   GET    /citas                   ?desde=&hasta=&estado= -> listado completo
 *   POST   /citas                   crea una cita ya confirmada (o el estado que se indique)
 *   PUT    /citas/{id}              cambia estado, notas o reagenda
 *   DELETE /citas/{id}
 *   PUT    /horarios/bloques        { bloques: [...] } sustituye el horario semanal
 *   POST   /bloqueos                { fecha, motivo } bloquea un día puntual
 *   DELETE /bloqueos/{id}
 *   PUT    /ajustes                 { duracionCitaMinutos, anticipacionMinimaHoras, diasAnticipacionMax }
 */

declare(strict_types=1);

// Los errores se registran, no se imprimen: un aviso de PHP en medio de la
// respuesta rompe el JSON y de paso enseña rutas del servidor.
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Las fechas y horas de citas y horarios son "hora de pared" en Ciudad de
// México, sin zona horaria adjunta. Si el servidor de Hostinger tuviera otro
// huso por defecto (muchos vienen en UTC), "hoy" y "ahora mismo" se calcularían
// mal y la anticipación mínima podría abrir o cerrar huecos varias horas antes
// o después de lo que realmente ve la doctora en su horario.
date_default_timezone_set('America/Mexico_City');

require __DIR__ . '/http.php';

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    send_error('Falta config.php. Copia config.example.php y rellena los datos.', 500);
}
$config = require $configPath;

require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/horarios.php';
require __DIR__ . '/citas.php';

apply_cors($config);

/**
 * Ruta pedida, con o sin mod_rewrite.
 *
 * Con el .htaccess de al lado llega en PATH_INFO. Si el hosting no tuviera
 * reescritura, se puede llamar igualmente como `index.php?path=/citas`.
 */
function requested_path(): string
{
    $path = $_SERVER['PATH_INFO'] ?? ($_GET['path'] ?? '/');
    $path = '/' . trim((string) $path, '/');
    return $path === '/' ? '/' : rtrim($path, '/');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = requested_path();

// /health responde sin nada más: sirve para comprobar que el archivo está bien
// subido y que PHP arranca, antes de tener nada configurado.
if ($path === '/health') {
    send_json([
        'ok' => true,
        'php' => PHP_VERSION,
        'configured' => true,
        'panel' => is_panel_configured($config),
    ]);
}

$pdo = db($config);
$segments = array_values(array_filter(explode('/', $path), static fn ($s) => $s !== ''));
$resource = $segments[0] ?? '';
$identifier = isset($segments[1]) ? rawurldecode($segments[1]) : null;

try {
    // --- Sesión del panel: pública por definición ---------------------------
    if ($path === '/login') {
        $method === 'POST' ? handle_login($pdo, $config) : send_error('Usa POST.', 405);
    }
    if ($path === '/logout') {
        $method === 'POST' ? handle_logout($pdo) : send_error('Usa POST.', 405);
    }
    if ($path === '/session') {
        $method === 'GET' ? handle_session($pdo, $config) : send_error('Usa GET.', 405);
    }

    // --- Horario y disponibilidad --------------------------------------------
    if ($path === '/horarios') {
        $method === 'GET' ? handle_get_horarios($pdo) : send_error('Usa GET.', 405);
    }
    if ($path === '/horarios/bloques') {
        require_auth($pdo, $config);
        $method === 'PUT' ? handle_put_bloques($pdo) : send_error('Usa PUT.', 405);
    }
    if ($path === '/disponibilidad') {
        $method === 'GET' ? handle_get_disponibilidad($pdo) : send_error('Usa GET.', 405);
    }
    if ($resource === 'bloqueos') {
        require_auth($pdo, $config);
        if ($method === 'POST' && $identifier === null) {
            handle_post_bloqueo($pdo);
        }
        if ($method === 'DELETE' && $identifier !== null) {
            handle_delete_bloqueo($pdo, $identifier);
        }
        send_error('Método no permitido en esta ruta.', 405);
    }
    if ($path === '/ajustes') {
        require_auth($pdo, $config);
        $method === 'PUT' ? handle_put_ajustes($pdo) : send_error('Usa PUT.', 405);
    }

    // --- Citas ---------------------------------------------------------------
    if ($resource === 'citas') {
        if ($method === 'GET' && $identifier === null) {
            require_auth($pdo, $config);
            handle_get_citas($pdo);
        }

        if ($method === 'POST' && $identifier === null) {
            // Autorizada o no: handle_post_cita decide el comportamiento según
            // haya o no una sesión válida.
            handle_post_cita($pdo, $config);
        }

        if ($identifier !== null) {
            require_auth($pdo, $config);
            $id = filter_var($identifier, FILTER_VALIDATE_INT);
            if ($id === false) {
                send_error('Identificador de cita inválido.', 422);
            }
            if ($method === 'PUT') {
                handle_put_cita($pdo, $id);
            }
            if ($method === 'DELETE') {
                handle_delete_cita($pdo, $id);
            }
        }

        send_error('Método no permitido en esta ruta.', 405);
    }

    send_error('Ruta desconocida.', 404);
} catch (Throwable $e) {
    // Lo que sea que se haya escapado: al log con todo el detalle, al cliente
    // sólo el hecho de que falló.
    error_log('[citas-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    send_error('Error interno del servidor.', 500);
}
