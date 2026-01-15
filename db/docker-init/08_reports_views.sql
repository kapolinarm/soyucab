BEGIN;
SET search_path TO public;

DROP VIEW IF EXISTS vw_reporte_crecimiento_registros_mes;

CREATE VIEW vw_reporte_crecimiento_registros_mes AS
SELECT
    date_trunc('month', p.fecha_registro)::date AS mes,
    CASE
        WHEN e.correo_electronico IS NOT NULL THEN 'ESTUDIANTE'
        WHEN pr.correo_electronico IS NOT NULL THEN 'PROFESOR'
        WHEN eg.correo_electronico IS NOT NULL THEN 'EGRESADO'
        WHEN pa.correo_electronico IS NOT NULL THEN 'ADMIN'
        ELSE 'PERSONA'
    END::text AS tipo,
    COUNT(*)::int AS nuevos_registros
FROM persona p
LEFT JOIN estudiante e ON e.correo_electronico = p.correo_electronico
LEFT JOIN profesor   pr ON pr.correo_electronico = p.correo_electronico
LEFT JOIN egresado   eg ON eg.correo_electronico = p.correo_electronico
LEFT JOIN personal_administrativo pa ON pa.correo_electronico = p.correo_electronico
GROUP BY 1, 2
ORDER BY mes ASC, tipo ASC;

DROP VIEW IF EXISTS vw_reporte_interaccion_usuarios;

CREATE VIEW vw_reporte_interaccion_usuarios AS
WITH conexiones AS (
    SELECT
        correo_electronico,
        COUNT(*)::int AS conexiones_aceptadas
    FROM (
        SELECT rp.correo_solicitante AS correo_electronico
        FROM relacion_de_personas rp
        WHERE upper(rp.estado) = 'ACEPTADA'
        UNION ALL
        SELECT rp.correo_receptor AS correo_electronico
        FROM relacion_de_personas rp
        WHERE upper(rp.estado) = 'ACEPTADA'
    ) x
    GROUP BY correo_electronico
),
grupos AS (
    SELECT
        m.correo_electronico,
        COUNT(*)::int AS grupos_participa
    FROM membresia m
    GROUP BY m.correo_electronico
),
eventos AS (
    SELECT
        a.correo_electronico,
        COUNT(*)::int AS eventos_registrado
    FROM asistencia_de_evento a
    GROUP BY a.correo_electronico
),
encuestas AS (
    SELECT
        r.correo_electronico,
        COUNT(*)::int AS encuestas_respondidas
    FROM respuesta_encuesta r
    GROUP BY r.correo_electronico
)
SELECT
    p.correo_electronico,
    p.nombres,
    p.apellidos,
    COALESCE(c.conexiones_aceptadas, 0) AS conexiones_aceptadas,
    COALESCE(g.grupos_participa, 0) AS grupos_participa,
    COALESCE(e.eventos_registrado, 0) AS eventos_registrado,
    COALESCE(en.encuestas_respondidas, 0) AS encuestas_respondidas,
    (COALESCE(c.conexiones_aceptadas, 0)
     + COALESCE(g.grupos_participa, 0)
     + COALESCE(e.eventos_registrado, 0)
     + COALESCE(en.encuestas_respondidas, 0)) AS score_interaccion
FROM persona p
LEFT JOIN conexiones c ON c.correo_electronico = p.correo_electronico
LEFT JOIN grupos g     ON g.correo_electronico = p.correo_electronico
LEFT JOIN eventos e    ON e.correo_electronico = p.correo_electronico
LEFT JOIN encuestas en ON en.correo_electronico = p.correo_electronico;

DROP VIEW IF EXISTS vw_reporte_top_grupos_miembros;

CREATE VIEW vw_reporte_top_grupos_miembros AS
SELECT
    g.nombre_grupo,
    g.privacidad,
    COUNT(m.correo_electronico)::int AS miembros
FROM grupo g
LEFT JOIN membresia m
  ON m.nombre_grupo = g.nombre_grupo
GROUP BY g.nombre_grupo, g.privacidad
ORDER BY miembros DESC, g.nombre_grupo;

DROP VIEW IF EXISTS vw_reporte_eventos_asistencia;

CREATE VIEW vw_reporte_eventos_asistencia AS
SELECT
    e.nombre_evento,
    e.fecha_inicio,
    e.ubicacion,
    COUNT(a.correo_electronico)::int AS total_registros,
    SUM(CASE WHEN upper(a.estado_asistencia) = 'ASISTIO' THEN 1 ELSE 0 END)::int AS total_asistio,
    SUM(CASE WHEN upper(a.estado_asistencia) = 'CONFIRMADO' THEN 1 ELSE 0 END)::int AS total_confirmado,
    SUM(CASE WHEN upper(a.estado_asistencia) = 'NO_ASISTIO' THEN 1 ELSE 0 END)::int AS total_no_asistio,
    CASE
        WHEN COUNT(a.correo_electronico) = 0 THEN 0
        ELSE ROUND(
            (SUM(CASE WHEN upper(a.estado_asistencia) = 'ASISTIO' THEN 1 ELSE 0 END)::numeric
             / COUNT(a.correo_electronico)::numeric) * 100
        , 2)
    END AS tasa_asistencia_pct
FROM evento e
LEFT JOIN asistencia_de_evento a
  ON a.nombre_evento = e.nombre_evento
 AND a.fecha_inicio  = e.fecha_inicio
GROUP BY e.nombre_evento, e.fecha_inicio, e.ubicacion
ORDER BY e.fecha_inicio DESC, e.nombre_evento;

DROP VIEW IF EXISTS vw_reporte_egresados_distribucion_geografica;

CREATE VIEW vw_reporte_egresados_distribucion_geografica AS
SELECT
    m.region_pais,
    c.nombre_capitulo,
    c.pais,
    c.ciudad
FROM mapa_de_egresados m
JOIN capitulo_regional c
  ON c.nombre_capitulo = m.nombre_capitulo;

COMMIT;
