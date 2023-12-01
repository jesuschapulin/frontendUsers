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

  constructor(
    private service: LocalServiceService,
    private router: Router
    ) {

    }
    data: any;
    responseRegister: any;
    ngOnInit() {
      $(document).ready(function () {
        console.log("cargando javascript:::::::");
        $('.datepicker').datepicker(); 
      });
    }
    prepareRegister() {
      var ngInstance=this;
      console.log("cadena a mandar en registro:::::::");
      var date=$('#formRegFecAlta').val(); 
      ngInstance.dataRegister.FECHAALTA=date;
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
}
