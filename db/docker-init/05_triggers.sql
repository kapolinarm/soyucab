SET search_path TO public;

DROP TRIGGER IF EXISTS trg_evento_no_dup_ubicacion_fecha ON evento;
DROP FUNCTION IF EXISTS fn_trg_evento_no_dup_ubicacion_fecha();

CREATE OR REPLACE FUNCTION fn_trg_evento_no_dup_ubicacion_fecha()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_ubicacion_norm TEXT;
BEGIN
    v_new_ubicacion_norm :=
        regexp_replace(lower(trim(NEW.ubicacion)), '\s+', ' ', 'g');

    IF TG_OP = 'INSERT' THEN
        IF EXISTS (
            SELECT 1
            FROM evento e
            WHERE regexp_replace(lower(trim(e.ubicacion)), '\s+', ' ', 'g') = v_new_ubicacion_norm
              AND e.fecha_inicio = NEW.fecha_inicio
        ) THEN
            RAISE EXCEPTION
                'No se permite insertar un evento con ubicacion (%) y fecha_inicio (%) porque ya existe otro evento en esa misma ubicacion y fecha.',
                NEW.ubicacion, NEW.fecha_inicio;
        END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        IF EXISTS (
            SELECT 1
            FROM evento e
            WHERE regexp_replace(lower(trim(e.ubicacion)), '\s+', ' ', 'g') = v_new_ubicacion_norm
              AND e.fecha_inicio = NEW.fecha_inicio
              AND NOT (
                  e.nombre_evento = OLD.nombre_evento
                  AND e.fecha_inicio = OLD.fecha_inicio
              )
        ) THEN
            RAISE EXCEPTION
                'No se permite actualizar un evento con ubicacion (%) y fecha_inicio (%) porque ya existe otro evento en esa misma ubicacion y fecha.',
                NEW.ubicacion, NEW.fecha_inicio;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_evento_no_dup_ubicacion_fecha
BEFORE INSERT OR UPDATE ON evento
FOR EACH ROW
EXECUTE FUNCTION fn_trg_evento_no_dup_ubicacion_fecha();
