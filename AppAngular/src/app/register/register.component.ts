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
    "EMAIL":""
  };
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
      /* if(this.usuario=="" || this.usuario==undefined){
        console.log("No se identifico el usuario:::::::"+this.usuario );
        this.goLogin();
      } */
    }
    prepareRegister() {
      var ngInstance=this;
      console.log("cadena a mandar en registro:::::::");
      var date=$('#formRegFecAlta').val(); 
      ngInstance.dataRegister.FECHAALTA=date;

      console.log("date a mandar en registro:::::::"+date);
      var date2 = new Date(ngInstance.dataRegister.FECHAALTA+" 00:00:00");
          // Get year, month, and day part from the date
          var year = date2.toLocaleString("default", { year: "numeric" });
          var month = date2.toLocaleString("default", { month: "2-digit" });
          var day = date2.toLocaleString("default", { day: "2-digit" });
          // Generate yyyy-mm-dd date string
          var formattedDate = day + "-" + month + "-" + year;
          console.log(formattedDate);
          ngInstance.dataRegister.FECHAALTA=formattedDate;
      $(document).ready(function () {
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
      });
      
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
