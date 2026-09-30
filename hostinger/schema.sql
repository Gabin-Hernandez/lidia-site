-- Esquema de la base de datos del administrador de citas de la Dra. Lidia Chávez.
--
-- Se ejecuta una sola vez, desde phpMyAdmin en el panel de Hostinger.
-- Ver hostinger/README.md para el paso a paso.

-- Horario de apertura, por bloques. Varios bloques por día permiten partir la
-- jornada (p. ej. 09:00-14:00 y 16:00-19:00 con descanso al mediodía) sin
-- inventar una columna por turno. Un día sin bloques activos es un día cerrado.
CREATE TABLE IF NOT EXISTS horario_bloques (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  dia_semana  TINYINT UNSIGNED NOT NULL,   -- 0=domingo … 6=sábado (como DAYOFWEEK-1)
  hora_inicio TIME NOT NULL,
  hora_fin    TIME NOT NULL,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_dia (dia_semana, activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Días puntuales cerrados (vacaciones, festivos, imprevistos), fuera del
-- patrón semanal de arriba.
CREATE TABLE IF NOT EXISTS bloqueos (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  fecha      DATE NOT NULL,
  motivo     VARCHAR(200) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uniq_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajustes del agendador en pares clave/valor: añadir uno nuevo no pide tocar
-- el esquema. Los que existen hoy están en seed.sql.
CREATE TABLE IF NOT EXISTS ajustes (
  clave      VARCHAR(60) NOT NULL,
  valor      VARCHAR(255) NOT NULL,
  PRIMARY KEY (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Citas solicitadas desde el calendario público o registradas a mano desde el
-- panel. `slot_activo` es una columna generada: NULL en cuanto la cita se
-- cancela, y por eso el índice único sobre ella impide dos citas pendientes o
-- confirmadas en el mismo hueco sin bloquear que ese hueco se reuse tras una
-- cancelación. MySQL no considera iguales dos NULL, así que muchas citas
-- canceladas pueden compartir fecha y hora sin chocar.
CREATE TABLE IF NOT EXISTS citas (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,

  nombre      VARCHAR(150) NOT NULL,
  telefono    VARCHAR(30)  NOT NULL,
  motivo      VARCHAR(200) NOT NULL DEFAULT '',
  notas       TEXT         NULL,

  fecha       DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin    TIME NOT NULL,

  estado      ENUM('pendiente','confirmada','cancelada','completada')
                           NOT NULL DEFAULT 'pendiente',
  notas_admin TEXT         NULL,

  slot_activo VARCHAR(20)  GENERATED ALWAYS AS (
                 IF(estado = 'cancelada', NULL, CONCAT(fecha, 'T', hora_inicio))
               ) STORED,

  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uniq_slot (slot_activo),
  KEY idx_fecha (fecha, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sesiones del panel. Se guarda el hash del token, nunca el token.
-- La API crea esta tabla sola si no existe; está aquí para instalaciones nuevas.
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash CHAR(64)  NOT NULL,
  expires_at DATETIME  NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (token_hash),
  KEY idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Intentos de login y de solicitud de cita, para frenar la fuerza bruta y el spam.
CREATE TABLE IF NOT EXISTS request_attempts (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  kind         VARCHAR(20)  NOT NULL,
  client_key   CHAR(64)     NOT NULL,
  attempted_at DATETIME     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_lookup (kind, client_key, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
