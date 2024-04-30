CREATE OR REPLACE PROCEDURE buscar_empresa_por_nombre(
    p_nombre IN VARCHAR2,
    v_id_empresa OUT NUMBER,
    v_nombre_resultado OUT VARCHAR2
) IS
BEGIN
    SELECT id_empresa, nombre
    INTO v_id_empresa, v_nombre_resultado
    FROM empresas
    WHERE nombre = p_nombre;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        v_id_empresa := NULL;
        v_nombre_resultado := NULL;
END buscar_empresa_por_nombre;



###########################################################ejecucion de sp en java
package com.example.demo;

import com.example.demo.User;
import com.example.demo.UserRowMapper;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.stereotype.Repository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.sql.CallableStatement;
import java.sql.Types;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;


import com.google.gson.Gson;
import java.util.Map;


import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.jdbc.core.simple.SimpleJdbcCall;

@Override
   public List<empresas> getPruebaSP() {
       List<empresas> lista=null;
       
       SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("buscar_empresa_por_nombre")
                .declareParameters(
                        new SqlParameter("p_nombre", Types.VARCHAR),
                        new SqlOutParameter("v_id_empresa", Types.INTEGER),
                        new SqlOutParameter("v_nombre_resultado", Types.VARCHAR)
                );

        Map<String, Object> inParams = Collections.singletonMap("p_nombre", "Empresa A");
        Map<String, Object> outParams = jdbcCall.execute(inParams);

        int idEmpresa = (int) outParams.get("v_id_empresa");
        String nombreResultado = (String) outParams.get("v_nombre_resultado");

        System.out.println("ID Empresa: " + idEmpresa + ", Nombre: " + nombreResultado);
        return lista;
   }