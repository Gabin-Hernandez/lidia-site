<?php
/**
 * Citas: solicitud pública y gestión desde el panel.
 *
 * La misma ruta POST /citas sirve a las dos: sin sesión, crea una solicitud
 * "pendiente" tras revalidar el hueco contra las reglas de horarios.php (no
 * basta con confiar en lo que mandó el navegador, que pudo quedarse con una
 * pantalla vieja); con sesión, la doctora puede registrar una cita ya
 * confirmada, incluso fuera de horario, para huecos que surgen por teléfono.
 *
 * El candado real contra citas duplicadas en el mismo hueco no es esta
 * revalidación —dos peticiones a la vez podrían pasarla las dos— sino el
 * índice único `uniq_slot` de la tabla, que sólo permite una cita activa por
 * fecha y hora exacta. Aquí sólo se atrapa el error que eso produce y se
 * convierte en un mensaje legible.
 */

declare(strict_types=1);

const CITA_MAX_SOLICITUDES = 6;
const CITA_VENTANA_MINUTOS = 30;

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'cancelada', 'completada'];

function fila_a_cita(array $c): array
{
    return [
        'id' => (int) $c['id'],
        'nombre' => $c['nombre'],
        'telefono' => $c['telefono'],
        'motivo' => $c['motivo'],
        'notas' => $c['notas'],
        'fecha' => $c['fecha'],
        'horaInicio' => substr($c['hora_inicio'], 0, 5),
        'horaFin' => substr($c['hora_fin'], 0, 5),
        'estado' => $c['estado'],
        'notasAdmin' => $c['notas_admin'],
        'creadaEn' => $c['created_at'],
    ];
}

function obtener_cita(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM citas WHERE id = ?');
    $stmt->execute([$id]);
    $fila = $stmt->fetch();
    return $fila ? fila_a_cita($fila) : null;
}

/** Ese hueco es un error de "ya no está disponible" y no un 500 genérico. */
function es_error_de_slot_duplicado(PDOException $e): bool
{
    return $e->errorInfo[1] === 1062; // MySQL: Duplicate entry
}

function validar_campos_cita(array $body, bool $esAdmin): array
{
    $nombre = trim((string) ($body['nombre'] ?? ''));
    $telefono = trim((string) ($body['telefono'] ?? ''));
    $motivo = trim((string) ($body['motivo'] ?? ''));
    $notas = trim((string) ($body['notas'] ?? ''));
    $fecha = (string) ($body['fecha'] ?? '');
    $hora = (string) ($body['hora'] ?? $body['horaInicio'] ?? '');

    $errores = [];
    if ($nombre === '' || mb_strlen($nombre) > 150) {
        $errores['nombre'] = 'Escribe un nombre (máximo 150 caracteres).';
    }
    if ($telefono === '' || mb_strlen($telefono) > 30) {
        $errores['telefono'] = 'Escribe un teléfono de contacto.';
    }
    if (mb_strlen($motivo) > 200) {
        $errores['motivo'] = 'El motivo es demasiado largo.';
    }
    if (mb_strlen($notas) > 1000) {
        $errores['notas'] = 'Las notas son demasiado largas.';
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $errores['fecha'] = 'Fecha inválida.';
    }
    if (!preg_match('/^\d{2}:\d{2}$/', $hora)) {
        $errores['hora'] = 'Hora inválida.';
    }
    if (!$esAdmin && $fecha < (new DateTimeImmutable('today'))->format('Y-m-d')) {
        $errores['fecha'] = 'Elige una fecha a partir de hoy.';
    }

    if ($errores !== []) {
        send_error('Revisa los campos marcados.', 422, ['fields' => $errores]);
    }

    return compact('nombre', 'telefono', 'motivo', 'notas', 'fecha', 'hora');
}

/** POST /citas — pública sin sesión (pendiente); con sesión, la doctora la crea ya confirmada. */
function handle_post_cita(PDO $pdo, array $config): void
{
    $esAdmin = is_authorized($pdo, $config);

    if (!$esAdmin) {
        if (count_recent_attempts($pdo, 'cita', CITA_VENTANA_MINUTOS) >= CITA_MAX_SOLICITUDES) {
            send_error('Demasiadas solicitudes seguidas. Espera unos minutos e inténtalo de nuevo.', 429);
        }
    }

    $body = read_json_body();
    $datos = validar_campos_cita($body, $esAdmin);

    if (!$esAdmin) {
        // Revalidación contra las reglas de horario vigentes: el hueco que el
        // navegador ofreció pudo haberse ocupado, bloqueado o quedar fuera de
        // la anticipación mínima mientras la paciente escribía sus datos.
        $disponibles = calcular_disponibilidad($pdo, $datos['fecha'], $datos['fecha']);
        if (!in_array($datos['hora'], $disponibles[$datos['fecha']] ?? [], true)) {
            record_attempt($pdo, 'cita');
            send_error('Ese horario ya no está disponible. Elige otro de la lista.', 409);
        }
    }

    $duracion = max(5, leer_ajustes($pdo)['duracion_cita_minutos']);
    $horaInicio = DateTimeImmutable::createFromFormat('H:i', $datos['hora']);
    $horaFin = $horaInicio->modify("+{$duracion} minutes");

    $estado = 'pendiente';
    if ($esAdmin) {
        $solicitado = (string) ($body['estado'] ?? 'confirmada');
        $estado = in_array($solicitado, ESTADOS_VALIDOS, true) ? $solicitado : 'confirmada';
    }

    try {
        $pdo->prepare(
            'INSERT INTO citas (nombre, telefono, motivo, notas, fecha, hora_inicio, hora_fin, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $datos['nombre'],
            $datos['telefono'],
            $datos['motivo'],
            $datos['notas'] !== '' ? $datos['notas'] : null,
            $datos['fecha'],
            $horaInicio->format('H:i:s'),
            $horaFin->format('H:i:s'),
            $estado,
        ]);
    } catch (PDOException $e) {
        if (es_error_de_slot_duplicado($e)) {
            if (!$esAdmin) {
                record_attempt($pdo, 'cita');
            }
            send_error('Ese horario ya no está disponible. Elige otro de la lista.', 409);
        }
        throw $e;
    }

    if (!$esAdmin) {
        clear_attempts($pdo, 'cita');
    }

    send_json(['cita' => obtener_cita($pdo, (int) $pdo->lastInsertId())], 201);
}

/** GET /citas?desde=&hasta=&estado=  — con sesión. */
function handle_get_citas(PDO $pdo): void
{
    $hoy = (new DateTimeImmutable('today'))->format('Y-m-d');
    $desde = (string) ($_GET['desde'] ?? $hoy);
    $hasta = (string) ($_GET['hasta'] ?? (new DateTimeImmutable($hoy))->modify('+60 days')->format('Y-m-d'));
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $desde) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $hasta)) {
        send_error('Las fechas deben tener el formato YYYY-MM-DD.', 422);
    }

    $sql = 'SELECT * FROM citas WHERE fecha BETWEEN ? AND ?';
    $params = [$desde, $hasta];

    $estado = (string) ($_GET['estado'] ?? '');
    if ($estado !== '') {
        $lista = array_values(array_intersect(explode(',', $estado), ESTADOS_VALIDOS));
        if ($lista !== []) {
            $marcadores = implode(',', array_fill(0, count($lista), '?'));
            $sql .= " AND estado IN ({$marcadores})";
            array_push($params, ...$lista);
        }
    }

    $sql .= ' ORDER BY fecha, hora_inicio';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    send_json(['citas' => array_map('fila_a_cita', $stmt->fetchAll())]);
}

/** PUT /citas/{id}  { estado?, notasAdmin?, fecha?, hora? }  — con sesión. */
function handle_put_cita(PDO $pdo, int $id): void
{
    $actual = obtener_cita($pdo, $id);
    if ($actual === null) {
        send_error('Esa cita no existe.', 404);
    }

    $body = read_json_body();
    $campos = [];
    $valores = [];

    if (array_key_exists('estado', $body)) {
        if (!in_array($body['estado'], ESTADOS_VALIDOS, true)) {
            send_error('Estado inválido.', 422);
        }
        $campos[] = 'estado = ?';
        $valores[] = $body['estado'];
    }

    if (array_key_exists('notasAdmin', $body)) {
        $notas = trim((string) $body['notasAdmin']);
        if (mb_strlen($notas) > 1000) {
            send_error('Las notas son demasiado largas.', 422);
        }
        $campos[] = 'notas_admin = ?';
        $valores[] = $notas !== '' ? $notas : null;
    }

    // Reagendar: si viene fecha u hora, hace falta la otra también, para no
    // dejar la cita con una combinación fecha/hora a medio actualizar.
    if (array_key_exists('fecha', $body) || array_key_exists('hora', $body)) {
        $fecha = (string) ($body['fecha'] ?? $actual['fecha']);
        $hora = (string) ($body['hora'] ?? $actual['horaInicio']);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha) || !preg_match('/^\d{2}:\d{2}$/', $hora)) {
            send_error('Fecha u hora inválidas.', 422);
        }
        $duracion = max(5, leer_ajustes($pdo)['duracion_cita_minutos']);
        $horaInicio = DateTimeImmutable::createFromFormat('H:i', $hora);
        $horaFin = $horaInicio->modify("+{$duracion} minutes");

        $campos[] = 'fecha = ?';
        $valores[] = $fecha;
        $campos[] = 'hora_inicio = ?';
        $valores[] = $horaInicio->format('H:i:s');
        $campos[] = 'hora_fin = ?';
        $valores[] = $horaFin->format('H:i:s');
    }

    if ($campos === []) {
        send_json(['cita' => $actual]);
    }

    $valores[] = $id;
    try {
        $pdo->prepare('UPDATE citas SET ' . implode(', ', $campos) . ' WHERE id = ?')->execute($valores);
    } catch (PDOException $e) {
        if (es_error_de_slot_duplicado($e)) {
            send_error('Ya hay otra cita activa en ese horario.', 409);
        }
        throw $e;
    }

    send_json(['cita' => obtener_cita($pdo, $id)]);
}

/** DELETE /citas/{id}  — con sesión. Borrado definitivo; para "no va a venir" se prefiere cancelar. */
function handle_delete_cita(PDO $pdo, int $id): void
{
    $stmt = $pdo->prepare('DELETE FROM citas WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        send_error('Esa cita no existe.', 404);
    }
    send_json(['deleted' => $id]);
}
