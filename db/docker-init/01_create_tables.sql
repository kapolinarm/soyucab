BEGIN;
SET search_path TO public;

DROP TABLE IF EXISTS transaccion_puntos_ucab CASCADE;
DROP TABLE IF EXISTS respuesta_encuesta CASCADE;
DROP TABLE IF EXISTS encuesta_institucional CASCADE;
DROP TABLE IF EXISTS postulacion_oferta CASCADE;
DROP TABLE IF EXISTS bolsa_trabajo_oferta CASCADE;
DROP TABLE IF EXISTS participante_proyecto CASCADE;
DROP TABLE IF EXISTS proyecto_colaborativo CASCADE;
DROP TABLE IF EXISTS asistencia_de_evento CASCADE;
DROP TABLE IF EXISTS evento CASCADE;
DROP TABLE IF EXISTS membresia CASCADE;
DROP TABLE IF EXISTS "grupo" CASCADE;
DROP TABLE IF EXISTS mapa_de_egresados CASCADE;
DROP TABLE IF EXISTS membresia_capitulo CASCADE;
DROP TABLE IF EXISTS capitulo_regional CASCADE;
DROP TABLE IF EXISTS organizacion_asociada CASCADE;
DROP TABLE IF EXISTS dependencias_ucab CASCADE;
DROP TABLE IF EXISTS certificacion_digital CASCADE;
DROP TABLE IF EXISTS recomendacion_de_habilidad CASCADE;
DROP TABLE IF EXISTS habilidad_de_persona CASCADE;
DROP TABLE IF EXISTS habilidad CASCADE;
DROP TABLE IF EXISTS tutoria CASCADE;
DROP TABLE IF EXISTS relacion_de_personas CASCADE;
DROP TABLE IF EXISTS configuracion_de_privacidad CASCADE;
DROP TABLE IF EXISTS personal_administrativo CASCADE;
DROP TABLE IF EXISTS egresado CASCADE;
DROP TABLE IF EXISTS profesor CASCADE;
DROP TABLE IF EXISTS estudiante CASCADE;
DROP TABLE IF EXISTS persona CASCADE;

CREATE TABLE Persona (
    correo_electronico VARCHAR(150) NOT NULL,
    nombres            VARCHAR(100) NOT NULL,
    apellidos          VARCHAR(100) NOT NULL,
    password           VARCHAR(255) NOT NULL,
    fecha_nacimiento   DATE NULL,
    url_foto           VARCHAR(300) NULL,
    biografia          TEXT NULL,
    total_puntos       INT DEFAULT 0,
    fecha_registro     DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT pk_persona PRIMARY KEY (correo_electronico)
);

CREATE TABLE estudiante (
    correo_electronico VARCHAR(150) NOT NULL,
    carrera            VARCHAR(120) NOT NULL,
    semestre           INT NOT NULL,
    fecha_ingreso      DATE NOT NULL,
    CONSTRAINT pk_estudiante PRIMARY KEY (correo_electronico),
    CONSTRAINT fk_estudiante_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona (correo_electronico)
);

CREATE TABLE profesor (
    correo_electronico VARCHAR(150) NOT NULL,
    departamento       VARCHAR(120) NOT NULL,
    tipo_contrato      VARCHAR(80)  NOT NULL,
    es_activo          BOOLEAN      NOT NULL,
    CONSTRAINT pk_profesor PRIMARY KEY (correo_electronico),
    CONSTRAINT fk_profesor_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona (correo_electronico)
);

CREATE TABLE egresado (
    correo_electronico VARCHAR(150) NOT NULL,
    fecha_grado        DATE NOT NULL,
    titulo             VARCHAR(150) NOT NULL,
    promocion          VARCHAR(50)  NOT NULL,
    CONSTRAINT pk_egresado PRIMARY KEY (correo_electronico),
    CONSTRAINT fk_egresado_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona (correo_electronico)
);

CREATE TABLE personal_administrativo (
    correo_electronico VARCHAR(150) NOT NULL,
    cargo              VARCHAR(120) NOT NULL,
    unidad             VARCHAR(120) NOT NULL,
    CONSTRAINT pk_personal_adm PRIMARY KEY (correo_electronico),
    CONSTRAINT fk_personal_adm_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico)
);

CREATE TABLE configuracion_de_privacidad (
    seccion_perfil     VARCHAR(80)  NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL,
    es_visible         BOOLEAN      NOT NULL,
    CONSTRAINT pk_conf_privacidad PRIMARY KEY (seccion_perfil, correo_electronico),
    CONSTRAINT fk_conf_privacidad_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico)
);

CREATE TABLE relacion_de_personas (
    correo_solicitante VARCHAR(150) NOT NULL,
    correo_receptor    VARCHAR(150) NOT NULL,
    tipo_relacion      VARCHAR(50)  NOT NULL,
    fecha_inicio       DATE         NOT NULL,
    estado             VARCHAR(30)  NOT NULL,
    CONSTRAINT pk_relacion_personas PRIMARY KEY (correo_solicitante, correo_receptor),
    CONSTRAINT fk_relacion_solicitante
        FOREIGN KEY (correo_solicitante)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_relacion_receptor
        FOREIGN KEY (correo_receptor)
        REFERENCES persona(correo_electronico)
);

CREATE TABLE tutoria (
    correo_tutor       VARCHAR(150) NOT NULL,
    correo_tutorado    VARCHAR(150) NOT NULL,
    area_conocimiento  VARCHAR(120) NOT NULL,
    estado             VARCHAR(30)  NOT NULL,
    CONSTRAINT pk_tutoria PRIMARY KEY (correo_tutor, correo_tutorado, area_conocimiento),
    CONSTRAINT fk_tutoria_profesor
        FOREIGN KEY (correo_tutor)
        REFERENCES profesor(correo_electronico),
    CONSTRAINT fk_tutoria_persona_tutorado
        FOREIGN KEY (correo_tutorado)
        REFERENCES persona(correo_electronico)
);
 
CREATE TABLE habilidad (
    nombre_habilidad VARCHAR(120) NOT NULL,
    categoria        VARCHAR(80)  NOT NULL,
    CONSTRAINT pk_habilidad PRIMARY KEY (nombre_habilidad)
);

CREATE TABLE habilidad_de_persona (
    correo_electronico VARCHAR(150) NOT NULL,
    nombre_habilidad   VARCHAR(120) NOT NULL,
    nivel              VARCHAR(30)  NOT NULL,
    CONSTRAINT pk_habilidad_persona PRIMARY KEY (correo_electronico, nombre_habilidad),
    CONSTRAINT fk_hdp_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_hdp_habilidad
        FOREIGN KEY (nombre_habilidad)
        REFERENCES habilidad(nombre_habilidad)
);

CREATE TABLE recomendacion_de_habilidad (
    correo_recomendador VARCHAR(150) NOT NULL,
    correo_recomendado  VARCHAR(150) NOT NULL,
    nombre_habilidad    VARCHAR(120) NOT NULL,
    CONSTRAINT pk_recomendacion_habilidad PRIMARY KEY (correo_recomendador, correo_recomendado, nombre_habilidad),
    CONSTRAINT fk_rec_hab_recomendador
        FOREIGN KEY (correo_recomendador)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_rec_hab_recomendado
        FOREIGN KEY (correo_recomendado)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_rec_hab_habilidad
        FOREIGN KEY (nombre_habilidad)
        REFERENCES habilidad(nombre_habilidad)
);
 
CREATE TABLE certificacion_digital (
    nombre_certificacion VARCHAR(150) NOT NULL,
    entidad_emisora      VARCHAR(150) NOT NULL,
    correo_electronico   VARCHAR(150) NOT NULL,
    fecha_emision        DATE         NOT NULL,
    url_validacion       VARCHAR(300) NULL,
    CONSTRAINT pk_certificacion_digital PRIMARY KEY (nombre_certificacion, entidad_emisora),
    CONSTRAINT fk_cert_digital_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico)
);

CREATE TABLE dependencias_ucab(
    nombre_dependencia VARCHAR(150) NOT NULL,
    tipo               VARCHAR(80)  NOT NULL,
    ubicacion          VARCHAR(150) NOT NULL,
    CONSTRAINT pk_dependencias_ucab PRIMARY KEY (nombre_dependencia)
);

CREATE TABLE organizacion_asociada (
    razon_social VARCHAR(200) NOT NULL,
    sector       VARCHAR(120) NOT NULL,
    sitio_web    VARCHAR(250) NULL,
    CONSTRAINT pk_organizacion_asociada PRIMARY KEY (razon_social)
);

CREATE TABLE capitulo_regional (
    nombre_capitulo VARCHAR(150) NOT NULL,
    pais            VARCHAR(100) NOT NULL,
    ciudad          VARCHAR(100) NOT NULL,
    CONSTRAINT pk_capitulo_regional PRIMARY KEY (nombre_capitulo)
);

CREATE TABLE membresia_capitulo (
    correo_electronico VARCHAR(150) NOT NULL,
    nombre_capitulo    VARCHAR(150) NOT NULL,
    fecha_ingreso      DATE         NOT NULL,
    CONSTRAINT pk_membresia_capitulo PRIMARY KEY (correo_electronico, nombre_capitulo),
    CONSTRAINT fk_mcap_egresado
        FOREIGN KEY (correo_electronico)
        REFERENCES egresado(correo_electronico),
    CONSTRAINT fk_mcap_capitulo
        FOREIGN KEY (nombre_capitulo)
        REFERENCES capitulo_regional(nombre_capitulo)
);

CREATE TABLE mapa_de_egresados (
    region_pais     VARCHAR(100) NOT NULL,
    nombre_capitulo VARCHAR(150) NOT NULL,
    CONSTRAINT pk_mapa_egresados PRIMARY KEY (region_pais),
    CONSTRAINT fk_mapa_capitulo
        FOREIGN KEY (nombre_capitulo)
        REFERENCES capitulo_regional(nombre_capitulo)
); 

CREATE TABLE "grupo"(
    nombre_grupo VARCHAR(150) NOT NULL,
    descripcion  TEXT         NOT NULL,
    privacidad   VARCHAR(30)  NOT NULL,
    CONSTRAINT pk_grupo PRIMARY KEY (nombre_grupo)
);

CREATE TABLE membresia (
    correo_electronico VARCHAR(150) NOT NULL,
    nombre_grupo       VARCHAR(150) NOT NULL,
    rol_en_grupo       VARCHAR(50)  NOT NULL,
    CONSTRAINT pk_membresia PRIMARY KEY (correo_electronico, nombre_grupo),
    CONSTRAINT fk_membresia_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_membresia_grupo
        FOREIGN KEY (nombre_grupo)
        REFERENCES "grupo"(nombre_grupo)
);

CREATE TABLE evento (
    nombre_evento      VARCHAR(150) NOT NULL,
    fecha_inicio       DATE         NOT NULL,
    ubicacion          VARCHAR(150) NOT NULL,
    nombre_dependencia VARCHAR(150) NULL,
    razon_social       VARCHAR(200) NULL,
    CONSTRAINT pk_evento PRIMARY KEY (nombre_evento, fecha_inicio),
    CONSTRAINT fk_evento_dependencia
        FOREIGN KEY (nombre_dependencia)
        REFERENCES dependencias_ucab(nombre_dependencia),
    CONSTRAINT fk_evento_organizacion
        FOREIGN KEY (razon_social)
        REFERENCES organizacion_asociada(razon_social)
);

CREATE TABLE asistencia_de_evento(
    correo_electronico VARCHAR(150) NOT NULL,
    nombre_evento      VARCHAR(150) NOT NULL,
    fecha_inicio       DATE         NOT NULL,
    estado_asistencia  VARCHAR(30)  NOT NULL,
    CONSTRAINT pk_asistencia_evento PRIMARY KEY (correo_electronico, nombre_evento, fecha_inicio),
    CONSTRAINT fk_asistencia_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_asistencia_evento
        FOREIGN KEY (nombre_evento, fecha_inicio)
        REFERENCES evento(nombre_evento, fecha_inicio)
);

CREATE TABLE proyecto_colaborativo (
    titulo_proyecto VARCHAR(200) NOT NULL,
    correo_creador  VARCHAR(150) NOT NULL,
    descripcion     TEXT         NOT NULL,
    CONSTRAINT pk_proyecto_colaborativo PRIMARY KEY (titulo_proyecto, correo_creador),
    CONSTRAINT fk_proyecto_creador
        FOREIGN KEY (correo_creador)
        REFERENCES persona(correo_electronico)
);

CREATE TABLE participante_proyecto (
    correo_electronico VARCHAR(150) NOT NULL,
    titulo_proyecto    VARCHAR(200) NOT NULL,
    correo_creador     VARCHAR(150) NOT NULL,
    rol                VARCHAR(50)  NOT NULL,
    CONSTRAINT pk_participante_proyecto PRIMARY KEY (correo_electronico, titulo_proyecto, correo_creador),
    CONSTRAINT fk_participante_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_participante_proyecto
        FOREIGN KEY (titulo_proyecto, correo_creador)
        REFERENCES proyecto_colaborativo(titulo_proyecto, correo_creador)
);

CREATE TABLE bolsa_trabajo_oferta (
    titulo_oferta     VARCHAR(200) NOT NULL,
    razon_social      VARCHAR(200) NOT NULL,
    descripcion       TEXT         NOT NULL,
    fecha_publicacion DATE         NOT NULL,
    estado            VARCHAR(20)  NOT NULL DEFAULT 'ACTIVA',
    CONSTRAINT pk_bolsa_trabajo_oferta PRIMARY KEY (titulo_oferta, razon_social),
    CONSTRAINT fk_bolsa_oferta_org
        FOREIGN KEY (razon_social)
        REFERENCES organizacion_asociada(razon_social)
);

CREATE TABLE postulacion_oferta (
    correo_electronico VARCHAR(150) NOT NULL,
    titulo_oferta      VARCHAR(200) NOT NULL,
    razon_social       VARCHAR(200) NOT NULL,
    fecha_postulacion  DATE         NOT NULL,
    estado             VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT pk_postulacion_oferta PRIMARY KEY (correo_electronico, titulo_oferta, razon_social),
    CONSTRAINT fk_postulacion_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_postulacion_oferta
        FOREIGN KEY (titulo_oferta, razon_social)
        REFERENCES bolsa_trabajo_oferta(titulo_oferta, razon_social)
);

CREATE TABLE encuesta_institucional (
    titulo_encuesta    VARCHAR(200) NOT NULL,
    fecha_creacion     DATE         NOT NULL,
    nombre_dependencia VARCHAR(150) NOT NULL,
    CONSTRAINT pk_encuesta_institucional PRIMARY KEY (titulo_encuesta, fecha_creacion),
    CONSTRAINT fk_encuesta_dependencia
        FOREIGN KEY (nombre_dependencia)
        REFERENCES dependencias_ucab(nombre_dependencia)
);

CREATE TABLE respuesta_encuesta (
    correo_electronico  VARCHAR(150) NOT NULL,
    titulo_encuesta     VARCHAR(200) NOT NULL,
    fecha_creacion      DATE         NOT NULL,
    contenido_respuesta TEXT         NOT NULL,
    CONSTRAINT pk_respuesta_encuesta PRIMARY KEY (correo_electronico, titulo_encuesta, fecha_creacion),
    CONSTRAINT fk_respuesta_persona
        FOREIGN KEY (correo_electronico)
        REFERENCES persona(correo_electronico),
    CONSTRAINT fk_respuesta_encuesta
        FOREIGN KEY (titulo_encuesta, fecha_creacion)
        REFERENCES encuesta_institucional(titulo_encuesta, fecha_creacion)
);

CREATE TABLE transaccion_puntos_ucab (
    correo_persona         VARCHAR(150) NOT NULL,
    fecha_hora_transaccion TIMESTAMP    NOT NULL,
    monto                  INT          NOT NULL,
    concepto               VARCHAR(200) NOT NULL,
    CONSTRAINT pk_transaccion_puntos PRIMARY KEY (correo_persona, fecha_hora_transaccion),
    CONSTRAINT fk_transaccion_persona
        FOREIGN KEY (correo_persona)
        REFERENCES persona(correo_electronico)
);

COMMIT;
