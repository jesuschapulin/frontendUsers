import { Component, OnInit, AfterViewInit,OnDestroy  } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LocalServiceService } from '../local.service.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-update',
  standalone: false,
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit {
  fecha="";
  dataEdition = {
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
  login= "";
  constructor(
    private service: LocalServiceService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.usuario = localStorage.getItem("usuario");
      console.log("usuario obtenido:::::::::: "+this.usuario);
      
    }
    data: any;
    responseEdition: any;
    paramsObject: any;
    ngOnInit() {
      $(document).ready(function () {
        console.log("cargando javascript edition:::::::");
        $('.datepicker').datepicker(); 
        $(".viweActive").attr("Style","background-color: lightgrey");
      });
      
      this.route.paramMap.subscribe(params => {
        var login = params.get('login');
        this.dataEdition.LOGIN=""+login;
        console.log(login);
        this.getDataUser();
      });
      if(this.usuario=="" || this.usuario==undefined){
        console.log("No se identifico el usuario:::::::"+this.usuario );
        this.goLogin();
      }
    }
    getDataUser() {
      var ngInstance=this;
      console.log("obtiene datos de login:::::::"+this.dataEdition.LOGIN);
      $(document).ready(function () {
        ngInstance.service.getDataUser(ngInstance.dataEdition).then(res => {
          var str = JSON.stringify(res);
          ngInstance.responseEdition = JSON.parse(str);
          console.log(ngInstance.responseEdition);
          console.log("obtiene datos de login:::::::"+ngInstance.dataEdition['LOGIN']);
          ngInstance.dataEdition.LOGIN=ngInstance.responseEdition[0].LOGIN;
          ngInstance.dataEdition.NOMBRE=ngInstance.responseEdition[0].NOMBRE;
          ngInstance.dataEdition.APELLIDO_PATERNO=ngInstance.responseEdition[0].APELLIDO_PATERNO;
          ngInstance.dataEdition.APELLIDO_MATERNO=ngInstance.responseEdition[0].APELLIDO_MATERNO;
          ngInstance.dataEdition.STATUS=ngInstance.responseEdition[0].STATUS;
          ngInstance.dataEdition.CLIENTE=ngInstance.responseEdition[0].CLIENTE;
          ngInstance.dataEdition.EMAIL=ngInstance.responseEdition[0].EMAIL;
          ngInstance.dataEdition.FECHA_VIGENCIA=ngInstance.responseEdition[0].FECHA_VIGENCIA;
          var date = new Date(ngInstance.dataEdition.FECHA_VIGENCIA);
          // Get year, month, and day part from the date
          var year = date.toLocaleString("default", { year: "numeric" });
          var month = date.toLocaleString("default", { month: "2-digit" });
          var day = date.toLocaleString("default", { day: "2-digit" });
          // Generate yyyy-mm-dd date string
          var formattedDate = year + "-" + month + "-" + day;
          console.log("fecha formada desde form:::::::::::::::::::::::");
          console.log(formattedDate);
          ngInstance.dataEdition.FECHA_VIGENCIA=formattedDate;
          console.log("cargando datos al formulario:::::::"+ngInstance.responseEdition[0].LOGIN);
          console.log(ngInstance.dataEdition);
          if(str.includes("fallo") ){
            Swal.fire(
              'Fallo la obtencion del usuario!',
              'puede ser que se perdiera la conexion con el servidor.',
              'error'
            );
          }else{
            Swal.fire({
              title: "Datos cargados!",
              text: "El usuario se ha obtenido sin problema",
              timer: 1000,
            }).then(function(result) {
              
            });
          }
        });
      });
      
    }
    prepareEdition() {
      var ngInstance=this;
      ngInstance.dataEdition.FECHA_VIGENCIA=$('#formEditFecVigencia').val();
      var date1 = new Date(ngInstance.dataEdition.FECHA_VIGENCIA+" 00:00:00");
      ngInstance.dataEdition.FECHA_VIGENCIA=ngInstance.formateData(""+date1);
      $(document).ready(function () {
        ngInstance.errors.nombre = ngInstance.dataEdition.NOMBRE=="" ? true : false;
        ngInstance.errors.apaterno = ngInstance.dataEdition.APELLIDO_PATERNO=="" ? true : false;
        ngInstance.errors.amaterno = ngInstance.dataEdition.APELLIDO_MATERNO=="" ? true : false;
        ngInstance.errors.fechavigencia = ngInstance.dataEdition.FECHA_VIGENCIA=="" ? true : false;
        ngInstance.errors.correo = ngInstance.dataEdition.EMAIL=="" ? true : false;
        console.log("errores:::: "+ngInstance.errors.user);
        if(ngInstance.errors.nombre==true
          || ngInstance.errors.apaterno==true || ngInstance.errors.amaterno==true 
          || ngInstance.errors.fechavigencia==true || ngInstance.errors.correo==true 
          ){
            Swal.fire(
              'No se puede completar el registro!',
              'Existen errores en los campos, favor de verificar.',
              'error'
            );
          }else{
            ngInstance.service.sendUserUpdate(ngInstance.dataEdition).then(res => {
              var str = JSON.stringify(res);
              ngInstance.responseEdition = JSON.parse(str);
              if(str.includes("fallo")){
                Swal.fire(
                  'Fallo la actualizacion del usuario!',
                  'puede ser que se perdiera la conexion con el servidor.',
                  'error'
                );
              }else{
                Swal.fire({
                  title: "Datos Actualizados!",
                  text: "El usuario se ha actualizado sin problema",
                  timer: 1000,
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
    goLogin() {
      this.router.navigateByUrl('/login');
    }
    goRegister() {
      this.router.navigateByUrl('/register');
    }
    goManage() {
      this.router.navigateByUrl('/manage');
    }
    goHome() {
      this.router.navigateByUrl('/home');
    }
    cancelEdit(){
      this.goHome();
    }
    goCloseSession() {
      console.log("cerrando sesión:::::::");
      localStorage.removeItem('usuario');
      location.reload();
    }
}
