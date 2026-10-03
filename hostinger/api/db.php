<?php
/** Conexión a MySQL. */

declare(strict_types=1);

function db(array $config): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['db_host'] ?? 'localhost',
        $config['db_name'] ?? ''
    );

    try {
        $pdo = new PDO($dsn, (string) ($config['db_user'] ?? ''), (string) ($config['db_pass'] ?? ''), [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Consultas preparadas de verdad, en el servidor. Con la emulación
            // activada PDO interpola los valores en el SQL antes de enviarlo,
            // que es justo lo que se quiere evitar.
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        // Todo en UTC, sin depender de cómo esté configurado el servidor. Las
        // fechas y horas de las citas se guardan y comparan como valores de
        // calendario locales (no hay zona horaria en DATE/TIME), así que esto
        // sólo afecta a las columnas TIMESTAMP (created_at/updated_at).
        $pdo->exec("SET time_zone = '+00:00'");
    } catch (PDOException $e) {
        // El mensaje de PDO lleva usuario y host: se registra, no se publica.
        error_log('[citas-api] fallo de conexión: ' . $e->getMessage());
        send_error('No se pudo conectar con la base de datos.', 500);
    }

    return $pdo;
}
