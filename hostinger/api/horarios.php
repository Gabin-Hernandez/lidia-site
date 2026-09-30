<?php
/**
 * Horario de apertura: bloques semanales, días bloqueados y ajustes del
 * agendador (duración de cita, anticipación mínima y máxima).
 *
 * También calcula la disponibilidad pública: qué horas concretas quedan
 * libres en un rango de fechas, cruzando el horario semanal con los días
 * bloqueados y las citas que ya existen. Esa cuenta se hace aquí y no en el
 * navegador para no tener que exponer la lista de citas (con nombre y
 * teléfono de otras pacientes) a quien sólo quiere ver huecos libres.
 */

declare(strict_types=1);

const AJUSTES_POR_DEFECTO = [
    'duracion_cita_minutos' => 30,
    'anticipacion_minima_horas' => 3,
    'dias_anticipacion_max' => 60,
];

/** Ajustes ya convertidos a enteros, con los valores por defecto si faltan. */
function leer_ajustes(PDO $pdo): array
{
    $filas = $pdo->query('SELECT clave, valor FROM ajustes')->fetchAll();
    $valores = AJUSTES_POR_DEFECTO;
    foreach ($filas as $fila) {
        if (array_key_exists($fila['clave'], $valores)) {
            $valores[$fila['clave']] = (int) $fila['valor'];
        }
    }
    return $valores;
}

function listar_bloques(PDO $pdo): array
{
    $filas = $pdo->query(
        'SELECT id, dia_semana, hora_inicio, hora_fin, activo
           FROM horario_bloques
          ORDER BY dia_semana, hora_inicio'
    )->fetchAll();

    return array_map(static fn (array $b) => [
        'id' => (int) $b['id'],
        'diaSemana' => (int) $b['dia_semana'],
        'horaInicio' => substr($b['hora_inicio'], 0, 5),
        'horaFin' => substr($b['hora_fin'], 0, 5),
        'activo' => (bool) $b['activo'],
    ], $filas);
}

function listar_bloqueos(PDO $pdo): array
{
    // Sólo los que quedan por venir: uno de hace un año no sirve para nada y
    // sólo ensucia la pantalla de "días cerrados" del panel.
    $filas = $pdo->prepare(
        'SELECT id, fecha, motivo FROM bloqueos WHERE fecha >= CURDATE() ORDER BY fecha'
    );
    $filas->execute();

    return array_map(static fn (array $b) => [
        'id' => (int) $b['id'],
        'fecha' => $b['fecha'],
        'motivo' => $b['motivo'],
    ], $filas->fetchAll());
}

/** GET /horarios — público: todo lo que hace falta para pintar el calendario y el panel. */
function handle_get_horarios(PDO $pdo): void
{
    send_json([
        'bloques' => listar_bloques($pdo),
        'bloqueos' => listar_bloqueos($pdo),
        'ajustes' => [
            'duracionCitaMinutos' => leer_ajustes($pdo)['duracion_cita_minutos'],
            'anticipacionMinimaHoras' => leer_ajustes($pdo)['anticipacion_minima_horas'],
            'diasAnticipacionMax' => leer_ajustes($pdo)['dias_anticipacion_max'],
        ],
    ]);
}

/**
 * PUT /horarios/bloques  { bloques: [{diaSemana, horaInicio, horaFin}, ...] }
 *
 * Sustituye el horario semanal completo: es más simple y más difícil de dejar
 * a medias que aceptar altas y bajas sueltas, y el panel siempre manda la
 * semana entera tal como quedó en pantalla.
 */
function handle_put_bloques(PDO $pdo): void
{
    $body = read_json_body();
    $bloques = $body['bloques'] ?? null;
    if (!is_array($bloques)) {
        send_error('Falta la lista de bloques.', 422);
    }

    $limpios = [];
    foreach ($bloques as $b) {
        if (!is_array($b)) {
            send_error('Cada bloque debe ser un objeto.', 422);
        }
        $dia = filter_var($b['diaSemana'] ?? null, FILTER_VALIDATE_INT);
        $inicio = (string) ($b['horaInicio'] ?? '');
        $fin = (string) ($b['horaFin'] ?? '');
        if ($dia === false || $dia < 0 || $dia > 6) {
            send_error('Día de la semana inválido.', 422);
        }
        if (!preg_match('/^\d{2}:\d{2}$/', $inicio) || !preg_match('/^\d{2}:\d{2}$/', $fin)) {
            send_error('La hora debe tener el formato HH:MM.', 422);
        }
        if ($inicio >= $fin) {
            send_error('La hora de inicio debe ser anterior a la de fin.', 422);
        }
        $limpios[] = [$dia, $inicio . ':00', $fin . ':00'];
    }

    $pdo->beginTransaction();
    try {
        $pdo->exec('DELETE FROM horario_bloques');
        $insert = $pdo->prepare(
            'INSERT INTO horario_bloques (dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, 1)'
        );
        foreach ($limpios as [$dia, $inicio, $fin]) {
            $insert->execute([$dia, $inicio, $fin]);
        }
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    send_json(['bloques' => listar_bloques($pdo)]);
}

/** POST /bloqueos  { fecha, motivo } */
function handle_post_bloqueo(PDO $pdo): void
{
    $body = read_json_body();
    $fecha = (string) ($body['fecha'] ?? '');
    $motivo = trim((string) ($body['motivo'] ?? ''));
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        send_error('Fecha inválida.', 422);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO bloqueos (fecha, motivo) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE motivo = VALUES(motivo)'
    );
    $stmt->execute([$fecha, $motivo]);

    send_json(['bloqueos' => listar_bloqueos($pdo)], 201);
}

/** DELETE /bloqueos/{id} */
function handle_delete_bloqueo(PDO $pdo, string $id): void
{
    $stmt = $pdo->prepare('DELETE FROM bloqueos WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        send_error('Ese día bloqueado no existe.', 404);
    }
    send_json(['bloqueos' => listar_bloqueos($pdo)]);
}

/** PUT /ajustes  { duracionCitaMinutos, anticipacionMinimaHoras, diasAnticipacionMax } */
function handle_put_ajustes(PDO $pdo): void
{
    $body = read_json_body();
    $mapa = [
        'duracion_cita_minutos' => $body['duracionCitaMinutos'] ?? null,
        'anticipacion_minima_horas' => $body['anticipacionMinimaHoras'] ?? null,
        'dias_anticipacion_max' => $body['diasAnticipacionMax'] ?? null,
    ];

    $stmt = $pdo->prepare(
        'INSERT INTO ajustes (clave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = VALUES(valor)'
    );
    foreach ($mapa as $clave => $valor) {
        if ($valor === null) {
            continue;
        }
        $entero = filter_var($valor, FILTER_VALIDATE_INT);
        if ($entero === false || $entero < 0) {
            send_error("El valor de {$clave} debe ser un número entero positivo.", 422);
        }
        $stmt->execute([$clave, $entero]);
    }

    $actual = leer_ajustes($pdo);
    send_json([
        'ajustes' => [
            'duracionCitaMinutos' => $actual['duracion_cita_minutos'],
            'anticipacionMinimaHoras' => $actual['anticipacion_minima_horas'],
            'diasAnticipacionMax' => $actual['dias_anticipacion_max'],
        ],
    ]);
}

/**
 * Huecos libres, día por día, entre `$desde` y `$hasta` (incluidos).
 *
 * @return array<string, list<string>> fecha ISO => lista de horas "HH:MM"
 */
function calcular_disponibilidad(PDO $pdo, string $desde, string $hasta): array
{
    $ajustes = leer_ajustes($pdo);
    $duracion = max(5, $ajustes['duracion_cita_minutos']);
    $anticipacionHoras = max(0, $ajustes['anticipacion_minima_horas']);

    $inicioRango = new DateTimeImmutable($desde);
    $finRango = new DateTimeImmutable($hasta);
    if ($finRango < $inicioRango) {
        send_error('El rango de fechas es inválido.', 422);
    }
    // Nunca más de 3 meses por consulta: es una pantalla de calendario, no una
    // exportación completa.
    if ($inicioRango->diff($finRango)->days > 93) {
        send_error('El rango de fechas es demasiado amplio.', 422);
    }

    // Bloques activos, agrupados por día de la semana.
    $bloquesPorDia = [];
    foreach (listar_bloques($pdo) as $b) {
        if ($b['activo']) {
            $bloquesPorDia[$b['diaSemana']][] = $b;
        }
    }

    $bloqueados = [];
    foreach ($pdo->query('SELECT fecha FROM bloqueos')->fetchAll() as $fila) {
        $bloqueados[$fila['fecha']] = true;
    }

    // Citas ya ocupadas (pendientes o confirmadas) en el rango: sólo se leen
    // fecha y hora, nunca el nombre ni el teléfono de la paciente.
    $ocupadas = [];
    $stmt = $pdo->prepare(
        "SELECT fecha, hora_inicio FROM citas
          WHERE fecha BETWEEN ? AND ? AND estado IN ('pendiente','confirmada')"
    );
    $stmt->execute([$inicioRango->format('Y-m-d'), $finRango->format('Y-m-d')]);
    foreach ($stmt->fetchAll() as $fila) {
        $ocupadas[$fila['fecha'] . ' ' . substr($fila['hora_inicio'], 0, 5)] = true;
    }

    $ahora = new DateTimeImmutable('now');
    $limiteMinimo = $ahora->modify("+{$anticipacionHoras} hours");

    $dias = [];
    $cursor = $inicioRango;
    while ($cursor <= $finRango) {
        $fechaIso = $cursor->format('Y-m-d');
        $diaSemana = (int) $cursor->format('w'); // 0=domingo … 6=sábado, igual que en la BD
        $slots = [];

        if (!isset($bloqueados[$fechaIso])) {
            foreach ($bloquesPorDia[$diaSemana] ?? [] as $bloque) {
                $slotInicio = DateTimeImmutable::createFromFormat('Y-m-d H:i', "{$fechaIso} {$bloque['horaInicio']}");
                $finBloque = DateTimeImmutable::createFromFormat('Y-m-d H:i', "{$fechaIso} {$bloque['horaFin']}");
                while ($slotInicio->modify("+{$duracion} minutes") <= $finBloque) {
                    if ($slotInicio >= $limiteMinimo) {
                        $clave = $fechaIso . ' ' . $slotInicio->format('H:i');
                        if (!isset($ocupadas[$clave])) {
                            $slots[] = $slotInicio->format('H:i');
                        }
                    }
                    $slotInicio = $slotInicio->modify("+{$duracion} minutes");
                }
            }
        }

        $dias[$fechaIso] = $slots;
        $cursor = $cursor->modify('+1 day');
    }

    return $dias;
}

/** GET /disponibilidad?desde=YYYY-MM-DD&hasta=YYYY-MM-DD */
function handle_get_disponibilidad(PDO $pdo): void
{
    $hoy = (new DateTimeImmutable('today'))->format('Y-m-d');
    $desde = (string) ($_GET['desde'] ?? $hoy);
    $hasta = (string) ($_GET['hasta'] ?? $desde);

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $desde) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $hasta)) {
        send_error('Las fechas deben tener el formato YYYY-MM-DD.', 422);
    }
    if ($desde < $hoy) {
        $desde = $hoy;
    }

    send_json(['dias' => calcular_disponibilidad($pdo, $desde, $hasta)]);
}
