BEGIN;
SET search_path TO public;

DROP FUNCTION IF EXISTS fn_es_miembro_grupo(VARCHAR, VARCHAR);

CREATE OR REPLACE FUNCTION fn_es_miembro_grupo(
    p_correo_electronico VARCHAR,
    p_nombre_grupo       VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM membresia m
        WHERE m.correo_electronico = p_correo_electronico
          AND m.nombre_grupo = p_nombre_grupo
    )
    INTO v_existe;

    RETURN v_existe;
END;
$$;

COMMIT;
