-- Datos iniciales del agendador. Se ejecuta una sola vez, después de schema.sql.
--
-- Todo esto se puede cambiar después desde el panel (/admin): este seed sólo
-- evita que el panel arranque completamente vacío. Volver a ejecutarlo no
-- duplica nada: usa INSERT IGNORE / ON DUPLICATE KEY sobre columnas únicas.

-- Horario de referencia: lunes a viernes con descanso al mediodía, sábado en
-- jornada corta, domingo cerrado (sin filas).
INSERT INTO horario_bloques (dia_semana, hora_inicio, hora_fin, activo) VALUES
  (1, '09:00:00', '14:00:00', 1), -- lunes
  (1, '16:00:00', '19:00:00', 1),
  (2, '09:00:00', '14:00:00', 1), -- martes
  (2, '16:00:00', '19:00:00', 1),
  (3, '09:00:00', '14:00:00', 1), -- miércoles
  (3, '16:00:00', '19:00:00', 1),
  (4, '09:00:00', '14:00:00', 1), -- jueves
  (4, '16:00:00', '19:00:00', 1),
  (5, '09:00:00', '14:00:00', 1), -- viernes
  (5, '16:00:00', '19:00:00', 1),
  (6, '09:00:00', '13:00:00', 1); -- sábado

INSERT INTO ajustes (clave, valor) VALUES
  ('duracion_cita_minutos', '30'),
  ('anticipacion_minima_horas', '3'),
  ('dias_anticipacion_max', '60')
ON DUPLICATE KEY UPDATE clave = clave;
