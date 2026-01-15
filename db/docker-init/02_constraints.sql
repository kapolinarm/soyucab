BEGIN;
SET search_path TO public;


ALTER TABLE relacion_de_personas
  DROP CONSTRAINT IF EXISTS chk_relacion_distintos;

ALTER TABLE relacion_de_personas
  ADD CONSTRAINT chk_relacion_distintos
  CHECK (correo_solicitante <> correo_receptor);


ALTER TABLE "grupo"
  DROP CONSTRAINT IF EXISTS chk_grupo_privacidad;

ALTER TABLE "grupo"
  ADD CONSTRAINT chk_grupo_privacidad
  CHECK (privacidad IN ('PUBLICO','PRIVADO'));


ALTER TABLE asistencia_de_evento
  DROP CONSTRAINT IF EXISTS chk_asistencia_estado;

ALTER TABLE asistencia_de_evento
  ADD CONSTRAINT chk_asistencia_estado
  CHECK (estado_asistencia IN ('CONFIRMADO','ASISTIO','NO_ASISTIO'));

COMMIT;
