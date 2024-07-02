select *from autosisar;


SELECT *
FROM AUTOSISAR
WHERE clave_empresa IN (SELECT clave_empresa FROM AUTOSISAR WHERE clave_empresa = 'CLAVE_10')
   OR empresa_nueva IN (SELECT empresa_nueva FROM AUTOSISAR WHERE empresa_nueva = 'CLAVE_10');


CREATE TABLE servicios_auto (
    id_servicio_auto NUMBER PRIMARY KEY,
    id_auto NUMBER,
    tipo_servicio VARCHAR2(100),
    fecha_servicio DATE,
    descripcion VARCHAR2(255)
);


CREATE TABLE poliza (
    id_servicio NUMBER PRIMARY KEY,
    id_servicio_auto NUMBER,
    tipo_poliza VARCHAR2(100),
    fecha_contrato DATE,
    cobertura VARCHAR2(255)
);


CREATE TABLE mantenimientos (
    id_servicio NUMBER PRIMARY KEY,
    id_servicio_auto NUMBER,
    tipo_mantenimiento VARCHAR2(100),
    fecha_mantenimiento DATE,
    descripcion VARCHAR2(255)
);



 INSERT INTO servicios_auto VALUES (1,1, 'Revisión general',sysdate, 'Revisión periódica del vehículo');


 INSERT INTO poliza VALUES (1,1, 'Seguro contra todo riesgo', sysdate, 'Cobertura amplia');
    
    
INSERT INTO mantenimientos VALUES (1,1, 'Cambio de aceite', TO_DATE('2024-05-01', 'YYYY-MM-DD'), 'Cambio de aceite y filtro');




SELECT a.*, 
    (SELECT s.tipo_servicio FROM servicios_auto s WHERE s.id_auto = a.id_auto) AS tipo_servicio,
    (SELECT s.fecha_servicio FROM servicios_auto s WHERE s.id_auto = a.id_auto) AS fecha_servicio,
    (SELECT m.tipo_mantenimiento FROM mantenimientos m WHERE m.id_servicio_auto = (SELECT s.id_servicio_auto FROM servicios_auto s WHERE s.id_auto = a.id_auto)) AS tipo_mantenimiento,
    (SELECT m.fecha_mantenimiento FROM mantenimientos m WHERE m.id_servicio_auto = (SELECT s.id_servicio_auto FROM servicios_auto s WHERE s.id_auto = a.id_auto)) AS fecha_mantenimiento,
    (SELECT p.tipo_poliza FROM poliza p WHERE p.id_servicio_auto = (SELECT s.id_servicio_auto FROM servicios_auto s WHERE s.id_auto = a.id_auto)) AS tipo_poliza,
    (SELECT p.fecha_contrato FROM poliza p WHERE p.id_servicio_auto = (SELECT s.id_servicio_auto FROM servicios_auto s WHERE s.id_auto = a.id_auto)) AS fecha_contrato
FROM AUTOSISAR a
WHERE a.clave_empresa = 'CLAVE_10'
   OR a.empresa_nueva = 'CLAVE_10';
   
   

---------------------------------------------------------------------------
-- Crear la vista normal
CREATE VIEW VW_AUTOSISAR AS
SELECT a.id_auto,
       a.auto,
       a.descripcion,
       a.serie,
       a.tarjetaCirculacion,
       a.color,
       a.colorengomado,
       a.STATUS,
       a.usuario,
       a.agencia,
       a.marca,
       (SELECT s.tipo_servicio FROM servicios_auto s WHERE s.id_auto = a.id_auto) AS tipo_servicio,
       (SELECT s.fecha_servicio FROM servicios_auto s WHERE s.id_auto = a.id_auto) AS fecha_servicio,
       (SELECT m.tipo_mantenimiento FROM mantenimientos m WHERE m.id_servicio_auto = (SELECT s.id_servicio_auto FROM servicios_auto s WHERE s.id_auto = a.id_auto)) AS tipo_mantenimiento,
       (SELECT m.fecha_mantenimiento FROM mantenimientos m WHERE m.id_servicio_auto = (SELECT s.id_servicio_auto FROM servicios_auto s WHERE s.id_auto = a.id_auto)) AS fecha_mantenimiento,
       (SELECT p.tipo_poliza FROM poliza p WHERE p.id_servicio_auto = (SELECT s.id_servicio_auto FROM servicios_auto s WHERE s.id_auto = a.id_auto)) AS tipo_poliza,
       (SELECT p.fecha_contrato FROM poliza p WHERE p.id_servicio_auto = (SELECT s.id_servicio_auto FROM servicios_auto s WHERE s.id_auto = a.id_auto)) AS fecha_contrato
FROM AUTOSISAR a;

-- Crear la vista materializada basada en la vista normal
CREATE MATERIALIZED VIEW data_autos_v200 AS
SELECT ID_AUTO, AUTO, DESCRIPCION, SERIE, TARJETACIRCULACION, COLOR, COLORENGOMADO, STATUS, USUARIO, AGENCIA, MARCA, TIPO_SERVICIO, FECHA_SERVICIO, TIPO_MANTENIMIENTO, FECHA_MANTENIMIENTO, TIPO_POLIZA, FECHA_CONTRATO
FROM VW_AUTOSISAR;



EXEC DBMS_MVIEW.REFRESH('DATA_AUTOS_V200', 'F'); -- activar primero



EXEC DBMS_MVIEW.REFRESH('data_autos_v200', 'C');


EXEC DBMS_MVIEW.REFRESH('data_autos_v200', 'F', force => TRUE);


select * from all_mviews;



select * from data_autos_v200;




CREATE OR REPLACE PROCEDURE ACTUALIZAR_VISTA_MATERIALIZADA
AS
    v_resultado NUMBER := 0;
BEGIN
    -- Actualiza la vista materializada (reemplaza 'nombre_vista' con el nombre real)
    DBMS_SNAPSHOT.REFRESH('data_autos_v200', 'C'); -- 'C' para actualización completa

    -- Si no se produce ningún error, establece el resultado en 1
    v_resultado := 1;

    -- Devuelve el resultado
    DBMS_OUTPUT.PUT_LINE('Resultado: ' || v_resultado);
END;
/


BEGIN
    ACTUALIZAR_VISTA_MATERIALIZADA;
END;




DROP PROCEDURE ACTUALIZAR_VISTA_MATERIALIZADA;



DROP MATERIALIZED VIEW data_autos_v200;


DROP VIEW VW_AUTOSISAR;



######################################################################################################################################
######################################################################################################################################
######################################################################################################################################
######################################################################################################################################
######################################################################################################################################


CREATE OR REPLACE PROCEDURE GET_DATA_FROM_data_autos_v200 (
    i_id_auto IN NUMBER,
    o_auto OUT VARCHAR2,
    o_descripcion OUT VARCHAR2,
    o_serie OUT VARCHAR2,
    o_tarjetaCirculacion OUT VARCHAR2,
    o_color OUT VARCHAR2,
    o_colorEngomado OUT VARCHAR2,
    o_status OUT CHAR,
    o_usuario OUT NUMBER,
    o_agencia OUT DATE,
    o_marca OUT DATE,
    o_tipo_servicio OUT VARCHAR2,
    o_fecha_servicio OUT DATE,
    o_tipo_mantenimiento OUT VARCHAR2,
    o_fecha_mantenimiento OUT DATE,
    o_tipo_poliza OUT VARCHAR2,
    o_fecha_contrato OUT DATE
)
AS
BEGIN
    SELECT 
        AUTO, 
        DESCRIPCION, 
        SERIE, 
        TARJETACIRCULACION, 
        COLOR, 
        COLORENGOMADO, 
        STATUS, 
        USUARIO, 
        AGENCIA, 
        MARCA, 
        TIPO_SERVICIO, 
        FECHA_SERVICIO, 
        TIPO_MANTENIMIENTO, 
        FECHA_MANTENIMIENTO, 
        TIPO_POLIZA, 
        FECHA_CONTRATO
    INTO 
        o_auto, 
        o_descripcion, 
        o_serie, 
        o_tarjetaCirculacion, 
        o_color, 
        o_colorEngomado, 
        o_status, 
        o_usuario, 
        o_agencia, 
        o_marca, 
        o_tipo_servicio, 
        o_fecha_servicio, 
        o_tipo_mantenimiento, 
        o_fecha_mantenimiento, 
        o_tipo_poliza, 
        o_fecha_contrato
    FROM data_autos_v200
    WHERE ID_AUTO = i_id_auto;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('No data found for ID_AUTO: ' || i_id_auto);
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/


SET SERVEROUTPUT ON;

DECLARE 
    v_auto VARCHAR2(50);
    v_descripcion VARCHAR2(50);
    v_serie VARCHAR2(50);
    v_tarjetaCirculacion VARCHAR2(50);
    v_color VARCHAR2(50);
    v_colorEngomado VARCHAR2(50);
    v_status CHAR(1);
    v_usuario NUMBER;
    v_agencia DATE;
    v_marca DATE;
    v_tipo_servicio VARCHAR2(50);
    v_fecha_servicio DATE;
    v_tipo_mantenimiento VARCHAR2(50);
    v_fecha_mantenimiento DATE;
    v_tipo_poliza VARCHAR2(50);
    v_fecha_contrato DATE;
BEGIN
    GET_DATA_FROM_data_autos_v200(
        i_id_auto => 1, -- Reemplaza 10 con el ID_AUTO deseado
        o_auto => v_auto,
        o_descripcion => v_descripcion,
        o_serie => v_serie,
        o_tarjetaCirculacion => v_tarjetaCirculacion,
        o_color => v_color,
        o_colorEngomado => v_colorEngomado,
        o_status => v_status,
        o_usuario => v_usuario,
        o_agencia => v_agencia,
        o_marca => v_marca,
        o_tipo_servicio => v_tipo_servicio,
        o_fecha_servicio => v_fecha_servicio,
        o_tipo_mantenimiento => v_tipo_mantenimiento,
        o_fecha_mantenimiento => v_fecha_mantenimiento,
        o_tipo_poliza => v_tipo_poliza,
        o_fecha_contrato => v_fecha_contrato
    );

    DBMS_OUTPUT.PUT_LINE('AUTO: ' || v_auto);
    DBMS_OUTPUT.PUT_LINE('DESCRIPCION: ' || v_descripcion);
    DBMS_OUTPUT.PUT_LINE('SERIE: ' || v_serie);
    DBMS_OUTPUT.PUT_LINE('TARJETACIRCULACION: ' || v_tarjetaCirculacion);
    DBMS_OUTPUT.PUT_LINE('COLOR: ' || v_color);
    DBMS_OUTPUT.PUT_LINE('COLORENGOMADO: ' || v_colorEngomado);
    DBMS_OUTPUT.PUT_LINE('STATUS: ' || v_status);
    DBMS_OUTPUT.PUT_LINE('USUARIO: ' || v_usuario);
    DBMS_OUTPUT.PUT_LINE('AGENCIA: ' || v_agencia);
    DBMS_OUTPUT.PUT_LINE('MARCA: ' || v_marca);
    DBMS_OUTPUT.PUT_LINE('TIPO_SERVICIO: ' || v_tipo_servicio);
    DBMS_OUTPUT.PUT_LINE('FECHA_SERVICIO: ' || v_fecha_servicio);
    DBMS_OUTPUT.PUT_LINE('TIPO_MANTENIMIENTO: ' || v_tipo_mantenimiento);
    DBMS_OUTPUT.PUT_LINE('FECHA_MANTENIMIENTO: ' || v_fecha_mantenimiento);
    DBMS_OUTPUT.PUT_LINE('TIPO_POLIZA: ' || v_tipo_poliza);
    DBMS_OUTPUT.PUT_LINE('FECHA_CONTRATO: ' || v_fecha_contrato);
END;
/

