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
    "EMAIL":""
  };
/*   charNoAc: string = "[^#/\"?%]+"; */
  login= "";
  constructor(
    private service: LocalServiceService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      
    }
    data: any;
    responseEdition: any;
    paramsObject: any;
    ngOnInit() {
      $(document).ready(function () {
        console.log("cargando javascript edition:::::::");
        $('.datepicker').datepicker(); 
      });
      
      this.route.paramMap.subscribe(params => {
        var login = params.get('login');
        this.dataEdition.LOGIN=""+login;
        console.log(login);
        this.getDataUser();
      });
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
          ngInstance.dataEdition.FECHAALTA=ngInstance.responseEdition[0].FECHAALTA;
          var date = new Date(ngInstance.dataEdition.FECHAALTA);
          // Get year, month, and day part from the date
          var year = date.toLocaleString("default", { year: "numeric" });
          var month = date.toLocaleString("default", { month: "2-digit" });
          var day = date.toLocaleString("default", { day: "2-digit" });
          // Generate yyyy-mm-dd date string
          var formattedDate = year + "-" + month + "-" + day;
          console.log("fecha formada desde form:::::::::::::::::::::::");
          console.log(formattedDate);
          ngInstance.dataEdition.FECHAALTA=formattedDate;
          console.log("cargando datos al formulario:::::::"+ngInstance.responseEdition[0].LOGIN);
          console.log(ngInstance.dataEdition);
          if(str.includes("fallo")){
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
      console.log("cadena a mandar en registro:::::::");
      var date=$('#formEditFecAlta').val(); 
      ngInstance.dataEdition.FECHAALTA=date;

      console.log("date a mandar en registro:::::::"+date);
      var date2 = new Date(ngInstance.dataEdition.FECHAALTA+" 00:00:00");
          // Get year, month, and day part from the date
          var year = date2.toLocaleString("default", { year: "numeric" });
          var month = date2.toLocaleString("default", { month: "2-digit" });
          var day = date2.toLocaleString("default", { day: "2-digit" });
          // Generate yyyy-mm-dd date string
          var formattedDate = day + "-" + month + "-" + year;
          console.log(formattedDate);
          ngInstance.dataEdition.FECHAALTA=formattedDate;
      $(document).ready(function () {
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
      });
      
    }
    goLogin() {
      this.router.navigateByUrl('/login');
    }
    goRegister() {
      this.router.navigateByUrl('/register');
    }
    goHome() {
      this.router.navigateByUrl('/home');
    }
    cancelEdit(){
      this.goHome();
    }
}
