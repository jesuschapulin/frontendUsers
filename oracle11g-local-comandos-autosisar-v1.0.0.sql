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



 INSERT INTO servicios_auto VALUES (1,1, 'Revisi�n general',sysdate, 'Revisi�n peri�dica del veh�culo');


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
   
   
CREATE MATERIALIZED VIEW data_autos
BUILD IMMEDIATE
REFRESH FAST ON COMMIT
AS
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
    