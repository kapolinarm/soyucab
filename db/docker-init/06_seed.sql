BEGIN;
SET search_path TO public;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

TRUNCATE TABLE
  asistencia_de_evento,
  respuesta_encuesta,
  encuesta_institucional,
  postulacion_oferta,
  bolsa_trabajo_oferta,
  participante_proyecto,
  proyecto_colaborativo,
  membresia,
  grupo,
  evento,
  recomendacion_de_habilidad,
  habilidad_de_persona,
  habilidad,
  tutoria,
  relacion_de_personas,
  configuracion_de_privacidad,
  membresia_capitulo,
  mapa_de_egresados,
  capitulo_regional,
  certificacion_digital,
  organizacion_asociada,
  dependencias_ucab,
  transaccion_puntos_ucab,
  estudiante,
  profesor,
  egresado,
  personal_administrativo,
  persona
CASCADE;

INSERT INTO dependencias_ucab(nombre_dependencia, tipo, ubicacion) VALUES
('Dirección de Egresados', 'ADMINISTRATIVA', 'Montalbán'),
('Biblioteca', 'SERVICIO', 'Montalbán'),
('Decanato Ingeniería', 'ACADEMICA', 'Montalbán'),
('Club de Robótica', 'EXTRACURRICULAR', 'Montalbán'),
('Centro de Estudiantes', 'ESTUDIANTIL', 'Montalbán');

INSERT INTO organizacion_asociada(razon_social, sector, sitio_web) VALUES
('TechNova C.A.', 'Tecnología', 'https://technova.example'),
('SaludPlus', 'Salud', 'https://saludplus.example'),
('FinanPro', 'Finanzas', 'https://finanpro.example');

INSERT INTO capitulo_regional(nombre_capitulo, pais, ciudad) VALUES
('Capítulo Caracas', 'Venezuela', 'Caracas'),
('Capítulo Valencia', 'Venezuela', 'Valencia'),
('Capítulo Bogotá', 'Colombia', 'Bogotá'),
('Capítulo Madrid', 'España', 'Madrid');

INSERT INTO mapa_de_egresados(region_pais, nombre_capitulo) VALUES
('Venezuela', 'Capítulo Caracas'),
('Colombia',  'Capítulo Bogotá'),
('España',    'Capítulo Madrid');

INSERT INTO habilidad(nombre_habilidad, categoria) VALUES
('Java', 'Programación'),
('PostgreSQL', 'Base de Datos'),
('React', 'Frontend'),
('Redes', 'Infraestructura'),
('Gestión de Proyectos', 'Gestión'),
('Ciberseguridad', 'Seguridad'),
('Python', 'Programación'),
('UX Básico', 'Diseño');

INSERT INTO persona(correo_electronico, nombres, apellidos, password, fecha_nacimiento, url_foto, biografia, total_puntos) VALUES
('admin@ucab.edu.ve',   'María',  'Pérez',   crypt('demo123', gen_salt('bf', 10)), '1985-04-12', NULL, 'Administrador del sistema.', 0),
('admin2@ucab.edu.ve',  'Luis',   'Rojas',   crypt('demo123', gen_salt('bf', 10)), '1988-09-02', NULL, 'Soporte y seguridad.', 0),

('prof1@ucab.edu.ve',   'Carmen', 'Suárez',  crypt('demo123', gen_salt('bf', 10)), '1979-01-20', NULL, 'Profesora de BD.', 0),
('prof2@ucab.edu.ve',   'Pedro',  'García',  crypt('demo123', gen_salt('bf', 10)), '1981-03-11', NULL, 'Profesor de Ingeniería.', 0),
('prof3@ucab.edu.ve',   'Ana',    'Méndez',  crypt('demo123', gen_salt('bf', 10)), '1976-06-05', NULL, 'Profesora de Sistemas.', 0),

('egr1@ucab.edu.ve',    'Diego',  'Martínez',crypt('demo123', gen_salt('bf', 10)), '1992-08-15', NULL, 'Egresado UCAB. Tecnología.', 0),
('egr2@ucab.edu.ve',    'Valeria','Romero',  crypt('demo123', gen_salt('bf', 10)), '1990-10-07', NULL, 'Egresada UCAB. Finanzas.', 0),
('egr3@ucab.edu.ve',    'Sofía',  'Herrera', crypt('demo123', gen_salt('bf', 10)), '1993-12-22', NULL, 'Egresada UCAB en España.', 0),

('est1@ucab.edu.ve',    'Kelly',  'Apolinar',crypt('demo123', gen_salt('bf', 10)), '2003-02-10', NULL, 'Estudiante de Ingeniería.', 0),
('est2@ucab.edu.ve',    'Claudia','López',   crypt('demo123', gen_salt('bf', 10)), '2002-05-19', NULL, 'Interesada en datos.', 0),
('est3@ucab.edu.ve',    'Santiago','Díaz',   crypt('demo123', gen_salt('bf', 10)), '2001-11-01', NULL, 'Me gustan los eventos.', 0),
('est4@ucab.edu.ve',    'Edwin',  'Silva',   crypt('demo123', gen_salt('bf', 10)), '2003-09-30', NULL, 'Fullstack.', 0),
('est5@ucab.edu.ve',    'David',  'Castro',  crypt('demo123', gen_salt('bf', 10)), '2002-01-08', NULL, 'Robótica.', 0),
('est6@ucab.edu.ve',    'Steven', 'Gómez',   crypt('demo123', gen_salt('bf', 10)), '2003-07-14', NULL, 'QA y testing.', 0),

('per1@ucab.edu.ve',    'Gabriel','Navas',   crypt('demo123', gen_salt('bf', 10)), '1995-03-03', NULL, 'Usuario general.', 0),
('per2@ucab.edu.ve',    'Carla',  'Vera',    crypt('demo123', gen_salt('bf', 10)), '1996-04-04', NULL, 'Usuario general.', 0);

INSERT INTO personal_administrativo(correo_electronico, cargo, unidad) VALUES
('admin@ucab.edu.ve', 'Administrador', 'TI'),
('admin2@ucab.edu.ve', 'Soporte', 'TI');

INSERT INTO profesor(correo_electronico, departamento, tipo_contrato, es_activo) VALUES
('prof1@ucab.edu.ve', 'Computación', 'Tiempo completo', true),
('prof2@ucab.edu.ve', 'Ingeniería', 'Medio tiempo', true),
('prof3@ucab.edu.ve', 'Sistemas', 'Tiempo completo', true);

INSERT INTO estudiante(correo_electronico, carrera, semestre, fecha_ingreso) VALUES
('est1@ucab.edu.ve', 'Ing. Informática', 5, '2024-09-15'),
('est2@ucab.edu.ve', 'Ing. Informática', 5, '2024-10-10'),
('est3@ucab.edu.ve', 'Ing. Sistemas',    6, '2025-01-05'),
('est4@ucab.edu.ve', 'Ing. Informática', 5, '2025-02-01'),
('est5@ucab.edu.ve', 'Ing. Sistemas',    6, '2025-03-10'),
('est6@ucab.edu.ve', 'Ing. Informática', 5, '2025-03-25');

INSERT INTO egresado(correo_electronico, fecha_grado, titulo, promocion) VALUES
('egr1@ucab.edu.ve', '2022-07-20', 'Ing. Informática', '2022'),
('egr2@ucab.edu.ve', '2023-12-10', 'Ing. Sistemas',    '2023'),
('egr3@ucab.edu.ve', '2024-06-15', 'Ing. Informática', '2024');

INSERT INTO membresia_capitulo(correo_electronico, nombre_capitulo, fecha_ingreso) VALUES
('egr1@ucab.edu.ve', 'Capítulo Caracas',  '2022-08-01'),
('egr2@ucab.edu.ve', 'Capítulo Valencia', '2024-01-10'),
('egr3@ucab.edu.ve', 'Capítulo Madrid',   '2024-07-01');

INSERT INTO configuracion_de_privacidad(seccion_perfil, correo_electronico, es_visible) VALUES
('BIOGRAFIA', 'est1@ucab.edu.ve', true),
('FOTO',      'est1@ucab.edu.ve', false),
('CONTACTO',  'est1@ucab.edu.ve', true),
('BIOGRAFIA', 'egr1@ucab.edu.ve', true),
('FOTO',      'egr1@ucab.edu.ve', true),
('CONTACTO',  'egr1@ucab.edu.ve', true);

INSERT INTO relacion_de_personas(correo_solicitante, correo_receptor, tipo_relacion, fecha_inicio, estado) VALUES
('est1@ucab.edu.ve', 'est2@ucab.edu.ve', 'AMISTAD', '2025-01-15', 'ACEPTADA'),
('est1@ucab.edu.ve', 'est3@ucab.edu.ve', 'AMISTAD', '2025-02-02', 'ACEPTADA'),
('est2@ucab.edu.ve', 'est4@ucab.edu.ve', 'AMISTAD', '2025-02-10', 'PENDIENTE'),
('est3@ucab.edu.ve', 'egr1@ucab.edu.ve', 'MENTORIA','2025-03-01', 'ACEPTADA'),
('per1@ucab.edu.ve', 'est1@ucab.edu.ve', 'AMISTAD', '2025-03-05', 'ACEPTADA');

INSERT INTO "grupo"(nombre_grupo, descripcion, privacidad) VALUES
('Robótica UCAB', 'Grupo de robótica y proyectos', 'PUBLICO'),
('BD 5to Semestre', 'Apoyo para Base de Datos', 'PRIVADO'),
('Eventos UCAB', 'Difusión de eventos y asistencia', 'PUBLICO'),
('Egresados Tech', 'Networking egresados', 'PRIVADO');

INSERT INTO membresia(correo_electronico, nombre_grupo, rol_en_grupo) VALUES
('est5@ucab.edu.ve', 'Robótica UCAB', 'ADMIN'),
('est1@ucab.edu.ve', 'Robótica UCAB', 'MIEMBRO'),
('est3@ucab.edu.ve', 'Robótica UCAB', 'MIEMBRO'),

('est1@ucab.edu.ve', 'BD 5to Semestre', 'ADMIN'),
('est2@ucab.edu.ve', 'BD 5to Semestre', 'MIEMBRO'),
('est6@ucab.edu.ve', 'BD 5to Semestre', 'MIEMBRO'),

('est3@ucab.edu.ve', 'Eventos UCAB', 'ADMIN'),
('est1@ucab.edu.ve', 'Eventos UCAB', 'MIEMBRO'),
('per2@ucab.edu.ve', 'Eventos UCAB', 'MIEMBRO'),

('egr1@ucab.edu.ve', 'Egresados Tech', 'ADMIN'),
('egr2@ucab.edu.ve', 'Egresados Tech', 'MIEMBRO'),
('egr3@ucab.edu.ve', 'Egresados Tech', 'MIEMBRO');

INSERT INTO evento(nombre_evento, fecha_inicio, ubicacion, nombre_dependencia, razon_social) VALUES
('Feria de Proyectos',      '2025-03-01', 'Auditorio Principal', 'Decanato Ingeniería', NULL),
('Charla PostgreSQL',       '2025-03-15', 'Sala 2 Biblioteca',   'Biblioteca',         NULL),
('Meetup Egresados',        '2025-04-05', 'Hall Central',        'Dirección de Egresados', 'TechNova C.A.'),
('Taller React Básico',     '2025-04-20', 'Laboratorio 1',       'Decanato Ingeniería', NULL),
('Encuentro Robótica',      '2025-05-10', 'Laboratorio Robótica','Club de Robótica',   NULL);

INSERT INTO asistencia_de_evento(correo_electronico, nombre_evento, fecha_inicio, estado_asistencia) VALUES
('est1@ucab.edu.ve', 'Feria de Proyectos',  '2025-03-01', 'ASISTIO'),
('est2@ucab.edu.ve', 'Feria de Proyectos',  '2025-03-01', 'CONFIRMADO'),
('est3@ucab.edu.ve', 'Feria de Proyectos',  '2025-03-01', 'NO_ASISTIO'),

('est1@ucab.edu.ve', 'Charla PostgreSQL',   '2025-03-15', 'ASISTIO'),
('est4@ucab.edu.ve', 'Charla PostgreSQL',   '2025-03-15', 'CONFIRMADO'),

('egr1@ucab.edu.ve', 'Meetup Egresados',    '2025-04-05', 'ASISTIO'),
('egr2@ucab.edu.ve', 'Meetup Egresados',    '2025-04-05', 'CONFIRMADO'),
('egr3@ucab.edu.ve', 'Meetup Egresados',    '2025-04-05', 'NO_ASISTIO'),

('est1@ucab.edu.ve', 'Taller React Básico', '2025-04-20', 'CONFIRMADO'),
('est5@ucab.edu.ve', 'Encuentro Robótica',  '2025-05-10', 'ASISTIO');

INSERT INTO encuesta_institucional(titulo_encuesta, fecha_creacion, nombre_dependencia) VALUES
('Satisfacción Biblioteca', '2025-03-10', 'Biblioteca'),
('Mejoras Ingeniería',      '2025-04-01', 'Decanato Ingeniería');

INSERT INTO respuesta_encuesta(correo_electronico, titulo_encuesta, fecha_creacion, contenido_respuesta) VALUES
('est1@ucab.edu.ve', 'Satisfacción Biblioteca', '2025-03-10', 'Excelente atención.'),
('est2@ucab.edu.ve', 'Satisfacción Biblioteca', '2025-03-10', 'Más espacios de estudio.'),
('est3@ucab.edu.ve', 'Mejoras Ingeniería',      '2025-04-01', 'Más laboratorios.'),
('egr1@ucab.edu.ve', 'Mejoras Ingeniería',      '2025-04-01', 'Más conexión con empresas.');

INSERT INTO bolsa_trabajo_oferta(titulo_oferta, razon_social, descripcion, fecha_publicacion, estado) VALUES
('Backend Junior', 'TechNova C.A.', 'Rol backend Node/Java', '2025-03-01', 'ACTIVA'),
('Data Analyst',   'FinanPro',      'Análisis de datos',     '2025-03-05', 'ACTIVA'),
('Soporte TI',     'SaludPlus',     'Soporte y redes',      '2025-02-20', 'CERRADA');

INSERT INTO postulacion_oferta(correo_electronico, titulo_oferta, razon_social, fecha_postulacion, estado) VALUES
('est1@ucab.edu.ve', 'Backend Junior', 'TechNova C.A.', '2025-03-10', 'PENDIENTE'),
('est4@ucab.edu.ve', 'Backend Junior', 'TechNova C.A.', '2025-03-12', 'PENDIENTE'),
('egr1@ucab.edu.ve', 'Data Analyst',   'FinanPro',      '2025-03-15', 'ACEPTADA');

INSERT INTO tutoria(correo_tutor, correo_tutorado, area_conocimiento, estado) VALUES
('prof1@ucab.edu.ve', 'est1@ucab.edu.ve', 'Base de Datos', 'ACTIVA'),
('prof2@ucab.edu.ve', 'est3@ucab.edu.ve', 'Ingeniería',    'ACTIVA');

INSERT INTO proyecto_colaborativo(titulo_proyecto, correo_creador, descripcion) VALUES
('App SoyUCAB', 'est1@ucab.edu.ve', 'Proyecto web para comunidad UCAB.'),
('Robot UCAB',  'est5@ucab.edu.ve', 'Proyecto de robótica colaborativo.');

INSERT INTO participante_proyecto(correo_electronico, titulo_proyecto, correo_creador, rol) VALUES
('est2@ucab.edu.ve', 'App SoyUCAB', 'est1@ucab.edu.ve', 'FRONT'),
('est4@ucab.edu.ve', 'App SoyUCAB', 'est1@ucab.edu.ve', 'BACK'),
('est6@ucab.edu.ve', 'App SoyUCAB', 'est1@ucab.edu.ve', 'QA'),
('est3@ucab.edu.ve', 'Robot UCAB',  'est5@ucab.edu.ve', 'SENSORES');

INSERT INTO certificacion_digital(nombre_certificacion, entidad_emisora, correo_electronico, fecha_emision, url_validacion) VALUES
('PostgreSQL Básico', 'UCAB',        'est1@ucab.edu.ve', '2025-02-01', NULL),
('React Básico',      'TechNova C.A.','est2@ucab.edu.ve','2025-02-15', NULL),
('Seguridad',         'FinanPro',    'egr1@ucab.edu.ve', '2024-11-10', NULL);

INSERT INTO habilidad_de_persona(correo_electronico, nombre_habilidad, nivel) VALUES
('est1@ucab.edu.ve', 'PostgreSQL', 'INTERMEDIO'),
('est1@ucab.edu.ve', 'React',      'BASICO'),
('est2@ucab.edu.ve', 'React',      'INTERMEDIO'),
('est4@ucab.edu.ve', 'Java',       'BASICO'),
('est5@ucab.edu.ve', 'Redes',      'BASICO'),
('egr1@ucab.edu.ve', 'Gestión de Proyectos', 'INTERMEDIO'),
('egr2@ucab.edu.ve', 'Ciberseguridad', 'BASICO');

INSERT INTO recomendacion_de_habilidad(correo_recomendador, correo_recomendado, nombre_habilidad) VALUES
('prof1@ucab.edu.ve', 'est1@ucab.edu.ve', 'PostgreSQL'),
('est1@ucab.edu.ve',  'est2@ucab.edu.ve', 'React'),
('egr1@ucab.edu.ve',  'est4@ucab.edu.ve', 'Java');

INSERT INTO transaccion_puntos_ucab(correo_persona, fecha_hora_transaccion, monto, concepto) VALUES
('est1@ucab.edu.ve', '2025-03-01 10:00:00',  20, 'Asistencia a evento'),
('est1@ucab.edu.ve', '2025-03-15 12:10:00',  30, 'Participación en charla'),
('est2@ucab.edu.ve', '2025-03-01 11:00:00',  10, 'Registro en evento'),
('egr1@ucab.edu.ve', '2025-04-05 09:30:00',  50, 'Meetup egresados'),
('est5@ucab.edu.ve', '2025-05-10 14:00:00',  40, 'Encuentro robótica');

UPDATE persona p
SET total_puntos = COALESCE(t.sum_monto, 0)
FROM (
  SELECT correo_persona, SUM(monto)::int AS sum_monto
  FROM transaccion_puntos_ucab
  GROUP BY correo_persona
) t
WHERE t.correo_persona = p.correo_electronico;

COMMIT;
