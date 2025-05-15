package com.example.demo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface  UserRepository extends JpaRepository<User, Integer>{
	@Query(value = "SELECT \r\n"
			+ "        u.CLIENTE,u.LOGIN,u.PASSWORD,u.NOMBRE,u.EMAIL,u.FECHAALTA,u.FECHABAJA,u.STATUS,u.INTENTOS,u.FECHAREVOCADO,u.FECHA_VIGENCIA,u.NO_ACCESO,u.APELLIDO_PATERNO,u.APELLIDO_MATERNO,u.AREA,u.FECHAMODIFICACION,\r\n"
			+ "        CASE \r\n"
			+ "            WHEN u.area = 1 THEN 'Caja'\r\n"
			+ "            WHEN u.area = 2 THEN 'Almacen'\r\n"
			+ "            WHEN u.area = 3 THEN 'Ventas'\r\n"
			+ "            ELSE 'Desconocido'\r\n"
			+ "        END AS nombre_area,\r\n"
			+ "        CASE \r\n"
			+ "            WHEN u.status = 'A' THEN 'Activo'\r\n"
			+ "            ELSE 'Inactivo'\r\n"
			+ "        END AS estado\r\n"
			+ "    FROM usuariosadea u\r\n"
			+ "    WHERE u.area = (\r\n"
			+ "        CASE \r\n"
			+ "            WHEN :area = 'Caja' THEN 1\r\n"
			+ "            WHEN :area = 'Almacen' THEN 2\r\n"
			+ "            WHEN :area = 'Ventas' THEN 3\r\n"
			+ "            ELSE NULL\r\n"
			+ "        END\r\n"
			+ "    )\r\n"
			+ "    AND (:email !='' OR u.email = :email)",
	nativeQuery = true)
    List<User> buscarPorArea(@Param("area") String area, @Param("email") String email);

/////funciona
//	@Query(value = "SELECT * FROM usuariosadea "
//			+ "WHERE area = "
//			+"CASE \r\n"
//			+ "WHEN :area = 'Caja' THEN 1 \r\n"
//			+ "WHEN :area = 'Almacen' THEN 2 \r\n"
//			+ "WHEN :area = :email THEN 3 \r\n"
//			+ "ELSE null \r\n"
//			+ "END ",
//			nativeQuery = true)
}
