BEGIN;

SET search_path TO public;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'r_soyucab_read') THEN
    CREATE ROLE r_soyucab_read NOLOGIN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'r_soyucab_app') THEN
    CREATE ROLE r_soyucab_app NOLOGIN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'r_soyucab_admin') THEN
    CREATE ROLE r_soyucab_admin NOLOGIN;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'soyucab_app') THEN
    CREATE ROLE soyucab_app LOGIN PASSWORD 'App_ChangeMe_2026';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'soyucab_readonly') THEN
    CREATE ROLE soyucab_readonly LOGIN PASSWORD 'Read_ChangeMe_2026';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'soyucab_admin') THEN
    CREATE ROLE soyucab_admin LOGIN PASSWORD 'Admin_ChangeMe_2026';
  END IF;
END $$;

GRANT r_soyucab_app TO soyucab_app;
GRANT r_soyucab_read TO soyucab_readonly;
GRANT r_soyucab_admin TO soyucab_admin;

GRANT r_soyucab_app TO r_soyucab_admin;
GRANT r_soyucab_read TO r_soyucab_admin;

GRANT CONNECT ON DATABASE soyucab TO r_soyucab_read, r_soyucab_app, r_soyucab_admin;

GRANT USAGE ON SCHEMA public TO r_soyucab_read, r_soyucab_app, r_soyucab_admin;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;

GRANT CREATE ON SCHEMA public TO r_soyucab_admin;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

GRANT SELECT ON
  persona,
  estudiante,
  profesor,
  egresado,
  personal_administrativo,
  configuracion_de_privacidad,
  relacion_de_personas,
  grupo,
  membresia,
  evento,
  asistencia_de_evento,
  encuesta_institucional,
  respuesta_encuesta,
  dependencias_ucab,
  organizacion_asociada,
  capitulo_regional,
  membresia_capitulo,
  mapa_de_egresados,
  bolsa_trabajo_oferta,
  postulacion_oferta,
  transaccion_puntos_ucab,
  habilidad,
  habilidad_de_persona,
  recomendacion_de_habilidad,
  certificacion_digital,
  proyecto_colaborativo,
  participante_proyecto
TO r_soyucab_read;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_crecimiento_registros_mes') THEN
    GRANT SELECT ON vw_reporte_crecimiento_registros_mes TO r_soyucab_read;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_interaccion_usuarios') THEN
    GRANT SELECT ON vw_reporte_interaccion_usuarios TO r_soyucab_read;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_top_grupos_miembros') THEN
    GRANT SELECT ON vw_reporte_top_grupos_miembros TO r_soyucab_read;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_eventos_asistencia') THEN
    GRANT SELECT ON vw_reporte_eventos_asistencia TO r_soyucab_read;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_egresados_distribucion_geografica') THEN
    GRANT SELECT ON vw_reporte_egresados_distribucion_geografica TO r_soyucab_read;
  END IF;
END $$;

GRANT SELECT ON
  persona,
  configuracion_de_privacidad,
  relacion_de_personas,
  grupo,
  membresia,
  evento,
  asistencia_de_evento,
  encuesta_institucional,
  respuesta_encuesta,
  dependencias_ucab,
  organizacion_asociada,
  capitulo_regional,
  mapa_de_egresados,
  bolsa_trabajo_oferta
TO r_soyucab_app;

GRANT INSERT, UPDATE ON
  persona,
  configuracion_de_privacidad,
  relacion_de_personas,
  grupo,
  membresia,
  evento,
  asistencia_de_evento,
  encuesta_institucional,
  respuesta_encuesta
TO r_soyucab_app;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_crecimiento_registros_mes') THEN
    GRANT SELECT ON vw_reporte_crecimiento_registros_mes TO r_soyucab_app;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_interaccion_usuarios') THEN
    GRANT SELECT ON vw_reporte_interaccion_usuarios TO r_soyucab_app;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_top_grupos_miembros') THEN
    GRANT SELECT ON vw_reporte_top_grupos_miembros TO r_soyucab_app;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_eventos_asistencia') THEN
    GRANT SELECT ON vw_reporte_eventos_asistencia TO r_soyucab_app;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='vw_reporte_egresados_distribucion_geografica') THEN
    GRANT SELECT ON vw_reporte_egresados_distribucion_geografica TO r_soyucab_app;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname='public' AND p.proname='fn_es_miembro_grupo'
  ) THEN
    GRANT EXECUTE ON FUNCTION fn_es_miembro_grupo TO r_soyucab_app, r_soyucab_read;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname='public' AND p.proname='sp_registrar_postulacion'
  ) THEN
    GRANT EXECUTE ON PROCEDURE sp_registrar_postulacion TO r_soyucab_app;
  END IF;
END $$;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO r_soyucab_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO r_soyucab_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO r_soyucab_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES FROM PUBLIC;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO r_soyucab_read;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO r_soyucab_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO r_soyucab_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO r_soyucab_app, r_soyucab_read;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO r_soyucab_admin;

COMMIT;
