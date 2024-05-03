#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
################### usuarios/empresas ###########################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################

CREATE OR REPLACE PROCEDURE buscar_empresa_por_nombre(
    i_nombre IN VARCHAR2,
    o_id_empresa OUT NUMBER,
    o_nombre_resultado OUT VARCHAR2
) IS
BEGIN
    SELECT id_empresa, nombre
    INTO o_id_empresa, o_nombre_resultado
    FROM empresas
    WHERE nombre = i_nombre;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        o_id_empresa := NULL;
        o_nombre_resultado := NULL;
END buscar_empresa_por_nombre;
############################## ejecucion de sp en sql 

DECLARE
    v_id_empresa NUMBER;
    v_nombre_resultado VARCHAR2(100);
BEGIN
    buscar_empresa_por_nombre('Empresa B', v_id_empresa, v_nombre_resultado);
    dbms_output.put_line('ID Empresa: ' || v_id_empresa || ', Nombre: ' || v_nombre_resultado);
END;


###################################### ejecucion de sp que busca por nombre en java 


@Override
   public List<empresas> getPruebaSP() {
       List<empresas> lista=null;
       
       SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("buscar_empresa_por_nombre")
                .declareParameters(
                        new SqlParameter("i_nombre", Types.VARCHAR),
                        new SqlOutParameter("o_id_empresa", Types.INTEGER),
                        new SqlOutParameter("o_nombre_resultado", Types.VARCHAR)
                );

        Map<String, Object> inParams = Collections.singletonMap("i_nombre", "Empresa A");
        Map<String, Object> outParams = jdbcCall.execute(inParams);

        int idEmpresa = (int) outParams.get("o_id_empresa");
        String nombreResultado = (String) outParams.get("o_nombre_resultado");

        System.out.println("ID Empresa: " + idEmpresa + ", Nombre: " + nombreResultado);
        return lista;
   }




#######################################################################################################
################### sp que obtiene la lista de empresas en sql #############################
#######################################################################################################

CREATE OR REPLACE PROCEDURE buscar_empresas(
    i_nombre IN VARCHAR2,
    o_cursor OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN o_cursor FOR
        SELECT id_empresa, nombre
        FROM empresas
        WHERE nombre is not null;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        NULL; -- Manejar la excepción si no se encuentra ningún resultado
END buscar_empresas;

##########################ejecutar en sql
DECLARE
    v_cursor SYS_REFCURSOR;
    v_id_empresa NUMBER;
    v_nombre_resultado VARCHAR2(100);
BEGIN
    buscar_empresas('Empresa x', v_cursor);

    LOOP
        FETCH v_cursor INTO v_id_empresa, v_nombre_resultado;
        EXIT WHEN v_cursor%NOTFOUND;

        dbms_output.put_line('ID Empresa: ' || v_id_empresa || ', Nombre: ' || v_nombre_resultado);
    END LOOP;

    CLOSE v_cursor;
END;

########################## ejecutar en java


@Override
   public List<empresas> buscarEmpresas() {
        List<empresas> empresas = new ArrayList<>();
        try {
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("buscar_empresas")
                    .returningResultSet("o_cursor", (rs, rowNum) -> {
                        // Imprimir los nombres de las columnas
                        ResultSetMetaData metaData = rs.getMetaData();
                        int columnCount = metaData.getColumnCount();
//                      for (int i = 1; i <= columnCount; i++) {
//                          System.out.println("Nombre de columna " + i + ": " + metaData.getColumnName(i));
//                      }
                        // Mapea cada fila del resultado del cursor a objetos Empresa
                        empresas empresa = new empresas();
                        empresa.setNombre(rs.getString("NOMBRE"));
                        empresa.setId_empresa(rs.getInt("ID_EMPRESA"));
                        // Mapea otros campos si es necesario
                        return empresa;
                    });
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("i_nombre", "Empresa A");
            Map<String, Object> result = jdbcCall.execute(params);
            // Accede a los resultados del procedimiento almacenado
            @SuppressWarnings("unchecked")
            List<empresas> resultados = (List<empresas>) result.get("o_cursor");
            empresas.addAll(resultados);
        } catch (Exception ex) {
            // Manejar la excepción apropiadamente, por ejemplo, logueándola o lanzándola nuevamente
            ex.printStackTrace();
        }
        return empresas;
   }
#######################################################################################################
#################################### sp de login
#######################################################################################################
CREATE OR REPLACE PROCEDURE validarUsuario(
    i_email IN VARCHAR2,
    i_secret IN VARCHAR2,
    o_id_empresa OUT NUMBER,
    o_nombre_resultado OUT VARCHAR2
) IS
BEGIN
    SELECT id_empresa, nombre
    INTO o_id_empresa, o_nombre_resultado
    FROM empresas
    WHERE emailempresa = i_email 
    and password=i_secret;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        o_id_empresa := NULL;
        o_nombre_resultado := NULL;
END validarUsuario;


#################################### ejecucion en sql

DECLARE
    v_id_empresa NUMBER;
    v_nombre_resultado VARCHAR2(100);
BEGIN
    validarUsuario('empresaA@gmail.com','empresaA', v_id_empresa, v_nombre_resultado);
    dbms_output.put_line('ID Empresa: ' || v_id_empresa || ', Nombre: ' || v_nombre_resultado);
END;

#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
################### seiones #####################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
#################################################################################################################
   CREATE TABLE sesiones (
    id_sesion NUMBER,
    sesion VARCHAR(255),
    fecha_registro VARCHAR(20),
    fecha_valida VARCHAR(20),
    estado CHAR(1)
);

   -- Insertar dos registros de ejemplo en la tabla "sesiones"
INSERT INTO sesiones (sesion, fecha_registro, fecha_valida, estado)
VALUES ('Sesión 1', '2024-04-30', '2024-05-15', 'A');

INSERT INTO sesiones (sesion, fecha_registro, fecha_valida, estado)
VALUES ('Sesión 2', '2024-05-01', '2024-05-20', 'I');

############# creacion de procedure para buscar sesiones
create or replace PROCEDURE GET_SESIONES(
    i_id_usuario IN NUMBER,
    i_sesion IN VARCHAR2 DEFAULT NULL,
    i_accion IN VARCHAR2,
    o_id_sesion OUT NUMBER,
    o_sesion OUT VARCHAR2,
    o_fecha_registro OUT VARCHAR2,
    o_fecha_valida OUT VARCHAR2
) IS
BEGIN
    SELECT id_sesion, sesion, fecha_registro, fecha_valida
    INTO o_id_sesion, o_sesion, o_fecha_registro, o_fecha_valida
    FROM sesiones
    WHERE (i_accion = 'vigente' AND id_usuario = i_id_usuario AND estado = 'S')
    OR (i_accion = 'relacion' AND id_usuario = i_id_usuario AND sesion = i_sesion AND estado = 'S')
    OR (i_accion = 'pasados' AND id_usuario = i_id_usuario AND estado = 'N') order by id_sesion desc ;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        o_id_sesion := NULL;
        o_sesion := NULL;
        o_fecha_registro := NULL;
        o_fecha_valida := NULL;
END GET_SESIONES;

################################## ejecucion en sql

DECLARE
    -- Declaración de variables locales
    MY_CURSOR SYS_REFCURSOR;
    V_ID_SESION NUMBER;
    V_SESION VARCHAR2(100);
    V_FECHA_REGISTRO VARCHAR2(100);
    V_FECHA_VALIDA VARCHAR2(100);
BEGIN
    -- Llama al procedimiento
    GET_SESIONES(
        I_ID_USUARIO => 1, -- Reemplaza con el ID de usuario deseado
        I_SESION => '', -- Reemplaza con la sesión deseada
        I_ACCION => 'pasados', -- Reemplaza con la acción deseada
        o_cursor => MY_CURSOR
    );

    -- Recupera los resultados
    FETCH MY_CURSOR INTO V_ID_SESION, V_SESION, V_FECHA_REGISTRO, V_FECHA_VALIDA;

    -- Muestra los resultados (puedes adaptarlo según tus necesidades)
    DBMS_OUTPUT.PUT_LINE('ID Sesión: ' || V_ID_SESION);
    DBMS_OUTPUT.PUT_LINE('Sesión: ' || V_SESION);
    DBMS_OUTPUT.PUT_LINE('Fecha de registro: ' || V_FECHA_REGISTRO);
    DBMS_OUTPUT.PUT_LINE('Fecha válida: ' || V_FECHA_VALIDA);
END;
------------------------------------------------------------------------------------
--------------------- alternativa dos comentando valores de ejecucion -------------
SET SERVEROUTPUT ON;

DECLARE
    i_id_usuario NUMBER(15) := 1; 
    i_sesion VARCHAR(255) := ''; 
    i_accion VARCHAR(255) := 'vigente'; 
    o_id_sesion NUMBER; 
    o_sesion VARCHAR(255); 
    o_fecha_registro VARCHAR(255); 
    o_fecha_valida VARCHAR(255); 
BEGIN
    SELECT id_sesion, sesion, fecha_registro, fecha_valida
    INTO o_id_sesion, o_sesion, o_fecha_registro, o_fecha_valida
    FROM sesiones
    WHERE (i_accion = 'vigente' AND id_usuario = i_id_usuario AND estado = 'S')
    OR (i_accion = 'relacion' AND id_usuario = i_id_usuario AND sesion = i_sesion AND estado = 'S')
    OR (i_accion = 'pasados' AND id_usuario = i_id_usuario AND estado = 'N') 
    ORDER BY id_sesion DESC;

    -- Mostrar los valores recuperados en la consola
    IF o_id_sesion IS NOT NULL THEN
        DBMS_OUTPUT.PUT_LINE('ID Sesion: ' || o_id_sesion);
        DBMS_OUTPUT.PUT_LINE('Sesion: ' || o_sesion);
        DBMS_OUTPUT.PUT_LINE('Fecha de Registro: ' || o_fecha_registro);
        DBMS_OUTPUT.PUT_LINE('Fecha Valida: ' || o_fecha_valida);
    ELSE
        DBMS_OUTPUT.PUT_LINE('No se encontraron sesiones.');
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        o_id_sesion := NULL;
        o_sesion := NULL;
        o_fecha_registro := NULL;
        o_fecha_valida := NULL;
        DBMS_OUTPUT.PUT_LINE('No se encontraron sesiones.');
END;


################################## ejecucion en java
@Override
   public List<sesiones> getSesionVigenteNormal(String id) {
       List<sesiones> lista = new ArrayList<sesiones>();
       SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GET_SESIONES")
                .declareParameters(
                        new SqlParameter("i_id_usuario", Types.INTEGER),
                        new SqlParameter("i_sesion", Types.VARCHAR), // Agrega el nuevo parámetro aquí
                        new SqlParameter("i_accion", Types.VARCHAR), // Agrega el nuevo parámetro aquí
                        new SqlOutParameter("o_id_sesion", Types.INTEGER),
                        new SqlOutParameter("o_sesion", Types.VARCHAR),
                        new SqlOutParameter("o_fecha_registro", Types.VARCHAR),
                        new SqlOutParameter("o_fecha_valida", Types.VARCHAR)
                );

       Map<String, Object> inParams = new HashMap<>();
       inParams.put("i_id_usuario", 1);
       inParams.put("i_sesion", "");
       inParams.put("i_accion", "vigente");
       ///inParams.put("i_otro_parametro", 123); // Reemplaza con el valor deseado
        Map<String, Object> outParams = jdbcCall.execute(inParams);

        int id_Sesion = (int) outParams.get("o_id_sesion");
        String sesion = (String) outParams.get("o_sesion");
        String fr = (String) outParams.get("o_fecha_registro");
        String fv = (String) outParams.get("o_fecha_valida");
        
        sesiones em = new sesiones();
        em.setId_sesion(id_Sesion);
        em.setSesion(sesion);
        em.setFecha_registro(fr);
        em.setFecha_valida(fv);
        
        lista.add(em);
        System.out.println("ID Empresa: " + id_Sesion + ", Nombre: " + sesion);
        return lista;
   }
