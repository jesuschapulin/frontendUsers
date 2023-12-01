import { Component,OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LocalServiceService } from '../local.service.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  dataLogin = {
    "LOGIN": "",
    "PASSWORD": ""
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
        console.log("cargando javascript del login:::::::");
      });
    }
    prepareAccess(){
      var ngInstance=this;
      console.log("cadena a mandar en login:::::::");
      $(document).ready(function () {
        ngInstance.service.validateAccessUser(ngInstance.dataLogin).then(res => {
          var str = JSON.stringify(res);
          ngInstance.responseRegister = JSON.parse(str);
          if(str.includes("fallo")){
            Swal.fire(
              'Fallo el acceso del usuario!',
              'puede ser que el nombre del usuario no exista o la contraseña se a incorrecta, intenta con datos diferentes por favor.',
              'error'
            );
          }else{
            Swal.fire({
              title: "Se verifico el registro exitosamente!",
              text: "se redireccionara a la lista de usuarios para su consulta",
              timer: 5000,
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
}
