#################################################################################################################
#################################################################################################################
################### pruebas de tablas de empresas ###############################################################
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
################### Sesiones ####################################################################################
#################################################################################################################
#################################################################################################################
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
    from(
        SELECT id_sesion, sesion, fecha_registro, fecha_valida
        FROM sesiones
        WHERE (i_accion = 'S' AND id_usuario = i_id_usuario AND estado = 'S')
        OR (i_accion = 'R' AND id_usuario = i_id_usuario AND sesion = i_sesion AND estado = 'S')
        OR (i_accion = 'N' AND id_usuario = i_id_usuario AND estado = 'N') order by id_sesion desc
    )
    WHERE ROWNUM = 1;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        o_id_sesion := NULL;
        o_sesion := NULL;
        o_fecha_registro := NULL;
        o_fecha_valida := NULL;
END GET_SESIONES;

################################## ejecucion en sql
DECLARE
    o_id_sesion  NUMBER;
    o_sesion  VARCHAR2(100);
    o_fecha_registro  VARCHAR2(100);
    o_fecha_valida  VARCHAR2(100);
BEGIN
    GET_SESIONES(1,'sesion3','R',o_id_sesion,o_sesion,o_fecha_registro,o_fecha_valida);
    dbms_output.put_line('ID sesion: ' || o_id_sesion);
    dbms_output.put_line('sesion: ' || o_sesion);
    dbms_output.put_line('fecha registro: ' || o_fecha_registro);
    dbms_output.put_line('fecha valida: ' || o_fecha_valida);
END;

------------------------------------------------------------------------------------
--------------------- alternativa dos comentando valores de ejecucion -------------
SET SERVEROUTPUT ON;

DECLARE
    i_id_usuario NUMBER(15) := 1; 
    i_sesion VARCHAR(255) := ''; 
    i_accion VARCHAR(255) := 'S'; 
    o_id_sesion NUMBER; 
    o_sesion VARCHAR(255); 
    o_fecha_registro VARCHAR(255); 
    o_fecha_valida VARCHAR(255); 
BEGIN
    SELECT id_sesion, sesion, fecha_registro, fecha_valida
    INTO o_id_sesion, o_sesion, o_fecha_registro, o_fecha_valida
    FROM sesiones
    WHERE (i_accion = 'S' AND id_usuario = i_id_usuario AND estado = 'S')
    OR (i_accion = 'R' AND id_usuario = i_id_usuario AND sesion = i_sesion AND estado = 'S')
    OR (i_accion = 'N' AND id_usuario = i_id_usuario AND estado = 'N') 
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
       inParams.put("i_accion", "S");
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
#################################################################################################################
###### registro de seion con sp
create or replace PROCEDURE insertar_sesion(
    i_id_sesion IN NUMBER,
    i_sesion IN VARCHAR2,
    i_fecha_registro IN VARCHAR2,
    i_fecha_valida IN VARCHAR2,
    i_estado IN VARCHAR2,
    i_id_usuario IN NUMBER,
    o_resultado OUT NUMBER
)
AS
BEGIN
    -- Intentar realizar el insert
    BEGIN
        INSERT INTO sesiones (ID_SESION, SESION, FECHA_REGISTRO, FECHA_VALIDA, ESTADO, ID_USUARIO)
        VALUES (i_id_sesion, i_sesion, sysdate, i_fecha_valida, i_estado, i_id_usuario);

        -- Si la inserción es exitosa, establecer el resultado como 1
        o_resultado := 1;
    EXCEPTION
        -- Si ocurre algún error durante la inserción, establecer el resultado como 0
        WHEN OTHERS THEN
            o_resultado := 0;
    END;
END;
######probar el sp con sql
SET SERVEROUTPUT ON;
DECLARE
    i_id_sesion NUMBER;
    i_sesion VARCHAR2(100);
    i_fecha_registro VARCHAR2(100);
    i_fecha_valida VARCHAR2(100);
    i_estado VARCHAR2(100);
    i_id_usuario NUMBER;
    o_resultado NUMBER;
BEGIN
    insertar_sesion(1,'testing','sysdate','','S',1,o_resultado);
    
    dbms_output.put_line('resultado: ' || o_resultado);
END;
######ejecutar con java
@Override
       public String InsertaSesion(String id) {
         String respuesta="";
           SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("insertar_sesion")
                    .declareParameters(
                            new SqlParameter("i_id_sesion", Types.INTEGER),
                            new SqlParameter("i_sesion", Types.VARCHAR), // Agrega el nuevo parámetro aquí
                            new SqlParameter("i_fecha_registro", Types.VARCHAR), // Agrega el nuevo parámetro aquí
                            new SqlParameter("i_fecha_valida", Types.VARCHAR),
                            new SqlParameter("i_estado", Types.VARCHAR), // Agrega el nuevo parámetro aquí
                            new SqlParameter("i_id_usuario", Types.INTEGER), // Agrega el nuevo parámetro aquí
                            new SqlOutParameter("o_resultado", Types.INTEGER)
                    );

           Map<String, Object> inParams = new HashMap<>();
           inParams.put("i_id_sesion", 1);
           inParams.put("i_sesion", "insertado desde spring con sp");
           inParams.put("i_fecha_registro", "sysdate");
           inParams.put("i_fecha_valida", "");
           inParams.put("i_estado", "S");
           inParams.put("i_id_usuario", 1);
           Map<String, Object> outParams = jdbcCall.execute(inParams);

            int o_resultado = (int) outParams.get("o_resultado");
            
            System.out.println("estado de insert: " + o_resultado);
            return respuesta;
       }
#################################################################################################################
###### actualizar de seion con sp
create or replace PROCEDURE actualizar_sesion(
    i_id_sesion IN NUMBER,
    i_accion IN VARCHAR2,
    o_resultado OUT NUMBER
)
AS
BEGIN
    BEGIN 
        IF i_accion = 'confirmar' THEN
            -- Actualizar solo la FECHA_VALIDA si la acción es 'confirmar'
            UPDATE sesiones
            SET FECHA_VALIDA = SYSTIMESTAMP
            WHERE ID_SESION = i_id_sesion;
            o_resultado := 1;
        ELSIF i_accion = 'cerrar' THEN
            -- Actualizar tanto la FECHA_VALIDA como el ESTADO si la acción es 'cerrar'
            UPDATE sesiones
            SET FECHA_VALIDA = SYSTIMESTAMP,
                ESTADO = 'N'
            WHERE ID_SESION = i_id_sesion;
            o_resultado := 1;
        ELSE
            -- Si la acción no es ni 'confirmar' ni 'cerrar', mostrar un mensaje de error
            DBMS_OUTPUT.PUT_LINE('Error: Acción no válida');
        END IF;
    EXCEPTION
        -- Si ocurre algún error durante la inserción, establecer el resultado como 0
        WHEN OTHERS THEN
            o_resultado := 0;
    END;
END;

###### probar actualizar seion con sp en sql
SET SERVEROUTPUT ON;
DECLARE
    i_id_sesion NUMBER;
    i_accion VARCHAR2(100);
    o_resultado NUMBER;
BEGIN
    actualizar_sesion(6,'confirmar',o_resultado);
    dbms_output.put_line('resultado: ' || o_resultado);
END;
########ejecucion enjava
@Override
       public String actualizaSesion(String id) {
         String respuesta="";
           SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("actualizar_sesion")
                    .declareParameters(
                            new SqlParameter("i_id_sesion", Types.INTEGER),
                            new SqlParameter("i_accion", Types.VARCHAR),
                            new SqlOutParameter("o_resultado", Types.INTEGER)
                    );

           Map<String, Object> inParams = new HashMap<>();
           inParams.put("i_id_sesion", 5);
           inParams.put("i_accion", "confirmar");
           Map<String, Object> outParams = jdbcCall.execute(inParams);

            int o_resultado = (int) outParams.get("o_resultado");
            
            System.out.println("estado de insert: " + o_resultado);
            return respuesta;
       }
#################################################################################################################
############ actualizar sesion con sp
create or replace PROCEDURE actualizar_sesion(
    i_id_sesion IN NUMBER,
    i_accion IN VARCHAR2,
    o_resultado OUT NUMBER
)
AS
BEGIN
    BEGIN 
        IF i_accion = 'confirmar' THEN
            -- Actualizar solo la FECHA_VALIDA si la acción es 'confirmar'
            UPDATE sesiones
            SET FECHA_VALIDA = SYSTIMESTAMP
            WHERE ID_SESION = i_id_sesion;
            o_resultado := 1;
        ELSIF i_accion = 'cerrar' THEN
            -- Actualizar tanto la FECHA_VALIDA como el ESTADO si la acción es 'cerrar'
            UPDATE sesiones
            SET FECHA_VALIDA = SYSTIMESTAMP,
                ESTADO = 'N'
            WHERE ID_SESION = i_id_sesion;
            o_resultado := 1;
        ELSE
            -- Si la acción no es ni 'confirmar' ni 'cerrar', mostrar un mensaje de error
            DBMS_OUTPUT.PUT_LINE('Error: Acción no válida');
        END IF;
    EXCEPTION
        -- Si ocurre algún error durante la inserción, establecer el resultado como 0
        WHEN OTHERS THEN
            o_resultado := 0;
    END;
END;
############ porbar el sp con sql
SET SERVEROUTPUT ON;
DECLARE
    i_id_sesion NUMBER;
    i_accion VARCHAR2(100);
    o_resultado NUMBER;
BEGIN
    actualizar_sesion(6,'confirmar',o_resultado);
    dbms_output.put_line('resultado: ' || o_resultado);
END;






#################################################################################################################
#################################################################################################################
################### Accesos ####################################################################################
#################################################################################################################
#################################################################################################################




######### crear un acceso con un sp
create or replace PROCEDURE insertar_acceso(
    i_id_acceso IN NUMBER,
    i_id_usuario IN NUMBER,
    o_resultado OUT NUMBER
)
AS
BEGIN
    -- Intentar realizar el insert
    BEGIN
        INSERT INTO accesos (id_acceso, id_usuario, fecha_acceso)
        VALUES (i_id_acceso, i_id_usuario, sysdate);

        -- Si la inserción es exitosa, establecer el resultado como 1
        o_resultado := 1;
    EXCEPTION
        -- Si ocurre algún error durante la inserción, establecer el resultado como 0
        WHEN OTHERS THEN
            o_resultado := 0;
    END;
END;

############### probar en sql 
SET SERVEROUTPUT ON;
DECLARE
    i_id_acceso NUMBER;
    i_id_usuario NUMBER;
    o_resultado NUMBER;
BEGIN
    insertar_acceso(1,1,o_resultado);
    
    dbms_output.put_line('resultado: ' || o_resultado);
END;
########### ejecutar en java
@Override
public String InsertaAcceso(String id) {
 String respuesta="";
   SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
            .withProcedureName("insertar_acceso")
            .declareParameters(
                    new SqlParameter("i_id_acceso", Types.INTEGER),
                    new SqlParameter("i_id_usuario", Types.INTEGER), // Agrega el nuevo parámetro aquí
                    new SqlOutParameter("o_resultado", Types.INTEGER)
            );

   Map<String, Object> inParams = new HashMap<>();
   inParams.put("i_id_acceso", 1);
   inParams.put("i_id_usuario", 1);
   Map<String, Object> outParams = jdbcCall.execute(inParams);

    int o_resultado = (int) outParams.get("o_resultado");
    
    System.out.println("estado de insert: " + o_resultado);
    return respuesta;
}





#################################################################################################################
#################################################################################################################
################### usuarios ####################################################################################
#################################################################################################################
#################################################################################################################

###### creacion de sp que obtiene usuario por id, email, o email y password
create or replace PROCEDURE get_usuario(
    i_id_usuario IN NUMBER DEFAULT NULL,
    i_email IN VARCHAR2 DEFAULT NULL,
    i_password IN VARCHAR2 DEFAULT NULL,
    o_id_usuario OUT NUMBER,
    o_nombre OUT VARCHAR2,
    o_apellido_paterno OUT VARCHAR2,
    o_apellido_materno OUT VARCHAR2,
    o_email OUT VARCHAR2,
    o_password OUT VARCHAR2,
    o_activo OUT CHAR,
    o_crear_usuarios OUT VARCHAR2,
    o_fecha_registro OUT TIMESTAMP,
    o_fecha_actualizacion OUT TIMESTAMP,
    o_perfil OUT CHAR,
    o_id_persona OUT NUMBER,
    o_telefono OUT NUMBER
) IS
BEGIN
    SELECT 
        id_usuario,
        nombre,
        apellido_paterno,
        apellido_materno,
        email,
        password,
        activo,
        crear_usuarios,
        fecha_registro,
        fecha_actualizacion,
        perfil,
        id_persona,
        telefono
    INTO 
        o_id_usuario,
        o_nombre,
        o_apellido_paterno,
        o_apellido_materno,
        o_email,
        o_password,
        o_activo,
        o_crear_usuarios,
        o_fecha_registro,
        o_fecha_actualizacion,
        o_perfil,
        o_id_persona,
        o_telefono
    FROM usuarios
    WHERE (id_usuario = i_id_usuario and i_id_usuario IS not NULL and i_email IS NULL and i_password IS NULL and activo='S')
    OR (email = i_email and i_email IS not NULL and i_id_usuario IS NULL and i_password IS NULL and activo='S')
    OR (password = i_password  and i_password IS not NULL and email = i_email and i_email IS not NULL and i_id_usuario IS NULL and activo='S') 
    ;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        o_id_usuario := NULL;
END get_usuario;


#################################################################################################################
############# para probar en sql despues de crear procedure
SET SERVEROUTPUT ON;
DECLARE
    o_id_usuario NUMBER;
    o_nombre VARCHAR2(100);
    o_apellido_paterno VARCHAR2(100);
    o_apellido_materno VARCHAR2(100);
    o_email VARCHAR2(100);
    o_password VARCHAR2(100);
    o_activo CHAR;
    o_crear_usuarios VARCHAR2(100);
    o_fecha_registro TIMESTAMP;
    o_fecha_actualizacion TIMESTAMP;
    o_perfil CHAR;
    o_id_persona NUMBER;
    o_telefono NUMBER;
BEGIN
    ------se deben pasar los parametros de entrada invocando el procedure, y despues los nombres de las salidas ya delcaradas antes del BEGIN
    get_usuario(2,'','',o_id_usuario,o_nombre,o_apellido_paterno,o_apellido_materno,o_email,o_password,o_activo,o_crear_usuarios,o_fecha_registro,o_fecha_actualizacion,o_perfil,o_id_persona,o_telefono);
    dbms_output.put_line('ID usuario: ' || o_id_usuario || ', Nombre: ' || o_nombre || ', email: ' || o_email || ', password: ' || o_password);
    dbms_output.put_line('perfil: ' || o_perfil);
    dbms_output.put_line('crear usuarios: ' || o_crear_usuarios);
    dbms_output.put_line('telefono: ' || o_telefono);
END;
#################################################################################################################
###########ejecucion en java
@Override
       public List<usuarios> getUsuario(String id) {
            List<usuarios> lista = new ArrayList<usuarios>();
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("GET_USUARIO")
                    .declareParameters(
                            new SqlParameter("i_id_usuario", Types.INTEGER),
                            new SqlParameter("i_email", Types.VARCHAR), // Agrega el nuevo parámetro aquí
                            new SqlParameter("i_password", Types.VARCHAR), // Agrega el nuevo parámetro aquí
                            new SqlOutParameter("o_id_usuario", Types.INTEGER),
                            new SqlOutParameter("o_nombre", Types.VARCHAR),
                            new SqlOutParameter("o_apellido_paterno", Types.VARCHAR),
                            new SqlOutParameter("o_apellido_materno", Types.VARCHAR),
                            new SqlOutParameter("o_email", Types.VARCHAR),
                            new SqlOutParameter("o_password", Types.VARCHAR),
                            new SqlOutParameter("o_activo", Types.VARCHAR),
                            new SqlOutParameter("o_crear_usuarios", Types.VARCHAR),
                            new SqlOutParameter("o_fecha_registro", Types.VARCHAR),
                            new SqlOutParameter("o_fecha_actualizacion", Types.VARCHAR),
                            new SqlOutParameter("o_perfil", Types.VARCHAR),
                            new SqlOutParameter("o_id_persona", Types.INTEGER),
                            new SqlOutParameter("o_telefono", Types.VARCHAR)
                    );

           Map<String, Object> inParams = new HashMap<>();
           inParams.put("i_id_usuario", 1);
           inParams.put("i_email", "");
           inParams.put("i_password", "");
           ///inParams.put("i_otro_parametro", 123); // Reemplaza con el valor deseado
            Map<String, Object> outParams = jdbcCall.execute(inParams);

            int id_usuario = (int) outParams.get("o_id_usuario");
            String nombre = (String) outParams.get("o_nombre");
            String ap = (String) outParams.get("o_apellido_paterno");
            String am = (String) outParams.get("o_apellido_materno");
            String email = (String) outParams.get("o_email");
            String password = (String) outParams.get("o_password");
            
            String o_activo = (String) outParams.get("o_activo");
            String o_crear_usuarios = (String) outParams.get("o_crear_usuarios");
            String o_fecha_registro = (String) outParams.get("o_fecha_registro");
            String o_fecha_actualizacion = (String) outParams.get("o_fecha_actualizacion");
            String o_perfil = (String) outParams.get("o_perfil");
            int o_id_persona = (int) outParams.get("o_id_persona");
            String o_telefono = (String) outParams.get("o_telefono");
            
            usuarios em = new usuarios();
            em.setId_usuario(""+id_usuario);
            em.setNombre(nombre);
            em.setApellido_paterno(ap);
            em.setApellido_materno(am);
            em.setEmail(email);
            em.setPassword(password);
            em.setActivo(""+o_activo.trim());
            em.setCrear_usuarios(""+o_crear_usuarios);
            em.setFecha_registro(o_fecha_registro);
            em.setFecha_actualizacion(o_fecha_actualizacion);
            em.setPerfil(""+o_perfil.trim());
            em.setId_persona(""+o_id_persona);
            em.setTelefono(""+o_telefono);
            lista.add(em);
            System.out.println("ID usuario: " + id_usuario + ", crear: "+o_crear_usuarios );
            return lista;
       }



#################################################################################################################
#################################################################################################################
################### autenticacion de permisos #################################################################
#################################################################################################################
#################################################################################################################
###sp dde permisos
create or replace PROCEDURE get_autorization(
    i_id_usuario IN NUMBER,
    o_resultado OUT NUMBER
) IS
BEGIN
    SELECT 
        id_usuario
    INTO 
        o_resultado
    FROM usuarios
    WHERE (id_usuario = i_id_usuario) and ((perfil='2' and crear_usuarios='S') or perfil='3') and activo='S'
    ;
    o_resultado := 1;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        o_resultado := 0;
END get_autorization;

### ejecuta en sql
SET SERVEROUTPUT ON;
DECLARE
    o_resultado NUMBER;
BEGIN
    get_autorization(2,o_resultado);
    dbms_output.put_line('autorizado: ' || o_resultado);
END;
