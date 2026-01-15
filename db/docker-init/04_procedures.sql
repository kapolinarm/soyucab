BEGIN;
SET search_path TO public;

DROP PROCEDURE IF EXISTS sp_registrar_postulacion(VARCHAR, VARCHAR, VARCHAR);

CREATE OR REPLACE PROCEDURE sp_registrar_postulacion(
    p_correo_electronico VARCHAR,
    p_titulo_oferta      VARCHAR,
    p_razon_social       VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_oferta VARCHAR(20);
    v_existe_postulacion BOOLEAN;
BEGIN
    SELECT estado
    INTO v_estado_oferta
    FROM bolsa_trabajo_oferta
    WHERE titulo_oferta = p_titulo_oferta
      AND razon_social  = p_razon_social;

    IF v_estado_oferta IS NULL THEN
        RAISE EXCEPTION 'La oferta (%) de (%) no existe', p_titulo_oferta, p_razon_social;
    END IF;

    IF v_estado_oferta <> 'ACTIVA' THEN
        RAISE EXCEPTION 'La oferta (%) de (%) no está ACTIVA (estado actual: %)',
            p_titulo_oferta, p_razon_social, v_estado_oferta;
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM postulacion_oferta
        WHERE correo_electronico = p_correo_electronico
          AND titulo_oferta      = p_titulo_oferta
          AND razon_social       = p_razon_social
    )
    INTO v_existe_postulacion;

    IF v_existe_postulacion THEN
        RAISE EXCEPTION 'Ya existe una postulación previa de (%) a la oferta (%) de (%)',
            p_correo_electronico, p_titulo_oferta, p_razon_social;
    END IF;

    INSERT INTO postulacion_oferta(
        correo_electronico,
        titulo_oferta,
        razon_social,
        fecha_postulacion,
        estado
    )
    VALUES (
        p_correo_electronico,
        p_titulo_oferta,
        p_razon_social,
        CURRENT_DATE,
        'PENDIENTE'
    );

END;
$$;

COMMIT;
