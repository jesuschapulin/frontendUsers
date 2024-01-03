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
        console.log("cargando javascript del login:::::::");
      });
      if(this.usuario!="" && this.usuario!=undefined){
        console.log("Ya se identifico el usuario:::::::"+this.usuario );
        this.goHome();
      }
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
              localStorage.setItem("usuario",ngInstance.responseRegister[0].LOGIN);
              console.log(localStorage.getItem("usuario"));
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
