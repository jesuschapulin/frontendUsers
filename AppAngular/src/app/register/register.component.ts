import { Component,OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LocalServiceService } from '../local.service.service';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  fecha="";
  dataRegister = {
    "LOGIN": "",
    "NOMBRE": "",
    "APELLIDO_PATERNO": "",
    "APELLIDO_MATERNO": "",
    "STATUS": "",
    "PASSWORD": "",
    "CLIENTE": "",
    "FECHAALTA":"",
    "FECHABAJA":"",
    "FECHA_VIGENCIA":"",
    "EMAIL":""
  };
  errors = {
    user:false,
    nombre:false,
    apaterno:false,
    amaterno:false,
    cliente:false,
    fechaalta:false,
    fechabaja:false,
    fechavigencia:false,
    estado:false,
    correo:false,
    password:false
  }
  messages={
    user:"(El usuario no puede estar vació)",
    nombre:"(El nombre no puede estar vació)",
    apaterno:"(El apellido paterno no puede estar vació)",
    amaterno:"(El apellido materno no puede estar vació)",
    cliente:"(El numero de cliente no puede estar vació)",
    fechaalta:"(La fecha de alta es necesaria)",
    fechabaja:"(La fecha de baja es necesaria)",
    fechavigencia:"(La fecha de vigencia es necesaria)",
    estado:"(se debe seleccionar el estado del usuario)",
    correo:"(El correo no puede estar vació)",
    password:"(La contraseña no puede estar vacía)"
  }
  usuario;
  constructor(
    private service: LocalServiceService,
    private router: Router
    ) {
      this.usuario = localStorage.getItem("usuario");
      console.log("usuario obtenido:::::::::: "+this.usuario);
    }
    data: any;
    responseRegister: any;
    ngOnInit() {
      $(document).ready(function () {
        console.log("cargando javascript:::::::");
        $('.datepicker').datepicker(); 
        $(".viweActive").attr("Style","background-color: lightgrey");
      });
       if(this.usuario=="" || this.usuario==undefined){
        console.log("No se identifico el usuario:::::::"+this.usuario );
        ///this.goLogin();
      } 
    }
    prepareRegister() {
      var ngInstance=this;
      ngInstance.dataRegister.FECHA_VIGENCIA=$('#formRegFecVigencia').val();
      console.log("fecha de vigencia:::::::"+ngInstance.dataRegister.FECHA_VIGENCIA );
      console.log("status:::::::"+ngInstance.dataRegister.STATUS);
      var date1 = new Date(ngInstance.dataRegister.FECHA_VIGENCIA+" 00:00:00");
          ngInstance.dataRegister.FECHA_VIGENCIA=this.formateData(""+date1);
      $(document).ready(function () {
        ngInstance.errors.user = ngInstance.dataRegister.LOGIN=="" ? true : false;
        ngInstance.errors.nombre = ngInstance.dataRegister.NOMBRE=="" ? true : false;
        ngInstance.errors.apaterno = ngInstance.dataRegister.APELLIDO_PATERNO=="" ? true : false;
        ngInstance.errors.amaterno = ngInstance.dataRegister.APELLIDO_MATERNO=="" ? true : false;
        ngInstance.errors.fechavigencia = ngInstance.dataRegister.FECHA_VIGENCIA=="" ? true : false;
        ngInstance.errors.correo = ngInstance.dataRegister.EMAIL=="" ? true : false;
        ngInstance.errors.password = ngInstance.dataRegister.PASSWORD=="" ? true : false;
        console.log("errores:::: "+ngInstance.errors.user);
        if(ngInstance.errors.user==true || ngInstance.errors.nombre==true
          || ngInstance.errors.apaterno==true || ngInstance.errors.amaterno==true 
          || ngInstance.errors.fechavigencia==true || ngInstance.errors.correo==true 
          || ngInstance.errors.password==true){
          Swal.fire(
            'No se puede completar el registro!',
            'Existen errores en los campos, favor de verificar.',
            'error'
          );
        }else{
          ngInstance.service.sendUserRegister(ngInstance.dataRegister).then(res => {
            var str = JSON.stringify(res);
            ngInstance.responseRegister = JSON.parse(str);
            if(str.includes("fallo")){
              Swal.fire(
                'Fallo el registro del usuario!',
                'puede ser que el nombre del usuario ya exista, intenta con uno diferente por favor.',
                'error'
              );
            }else{
              Swal.fire({
                title: "Se creo el registro exitosamente!",
                text: "se redireccionara a la lista de usuarios para su consulta",
                timer: 5000,
              }).then(function(result) {
                ngInstance.goHome();
              });
            }
          });
        }
      });
      
    }
    formateData(fecha: String){
        var date = new Date(""+fecha);
        // Get year, month, and day part from the date
        var year = date.toLocaleString("default", { year: "numeric" });
        var month = date.toLocaleString("default", { month: "2-digit" });
        var day = date.toLocaleString("default", { day: "2-digit" });
        // Generate yyyy-mm-dd date string
        /* var formattedDate = year + "-" + month + "-" + day; */
        var formattedDate = day + "-" + month + "-" + year;
    return formattedDate;
  }
    goManage() {
      this.router.navigateByUrl('/manage');
    }
    goHome() {
      this.router.navigateByUrl('/home');
    }
    goLogin() {
      this.router.navigateByUrl('/login');
    }
    goCloseSession() {
      console.log("cerrando sesión:::::::");
      localStorage.removeItem('usuario');
      location.reload();
    }
}
