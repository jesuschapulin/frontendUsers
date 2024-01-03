import { Component, OnInit, AfterViewInit,OnDestroy  } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LocalServiceService } from '../local.service.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-manage',
  standalone: false,
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit{
  data: any;
  responseRegister: any;
  dataDeleteAccess = {
    "LOGIN": "",
    "NOMBRE": ""
  };
  usuario;
  constructor(
    private service: LocalServiceService,
    private router: Router
    ) {
      this.usuario = localStorage.getItem("usuario");
      console.log("usuario obtenido:::::::::: "+this.usuario);
    }
    ngOnInit() {
      this.prepareSearch();
      $(document).ready(function () {
        console.log("cargando javascript de manage:::::::");
        $(".viweActive").attr("Style","background-color: lightgrey");
      });
      if(this.usuario=="" || this.usuario==undefined){
        console.log("No se identifico el usuario:::::::"+this.usuario );
        this.goLogin();
      }
    }
    prepareSearch() {
      console.log("cadena a buscar en home:::::::");
      this.service.getInfoFilters().then(res => {
        var str = JSON.stringify(res);
        this.data = JSON.parse(str);
        console.log(this.data);
        for (let usr in this.data) {
          console.log(this.data[usr].FECHAALTA);
          var date = new Date(this.data[usr].FECHAALTA);
          // Get year, month, and day part from the date
          var year = date.toLocaleString("default", { year: "numeric" });
          var month = date.toLocaleString("default", { month: "2-digit" });
          var day = date.toLocaleString("default", { day: "2-digit" });
          // Generate yyyy-mm-dd date string
          /* var formattedDate = year + "-" + month + "-" + day; */
          var formattedDate = day + "-" + month + "-" + year;
          console.log("fecha formada desde tabla:::::::::::::::::::::::");
          console.log(formattedDate);
          this.data[usr].FECHAALTA=formattedDate;
        }
        console.log(this.data);
      });
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
    goLogin() {
      this.router.navigateByUrl('/login');
    }
    goCloseSession() {
      console.log("cerrando sesión:::::::");
      localStorage.removeItem('usuario');
      location.reload();
    }
    EditUser(login: String) {
      console.log(login);
      this.router.navigate(['/update', login]);
    }
    deleteUser(login: String, nombre: String) {
      var ngInstance=this;
      ngInstance.dataDeleteAccess.LOGIN=""+login;
      ngInstance.dataDeleteAccess.NOMBRE=""+nombre;
      console.log("cadena a mandar en eliminacion:::::::"+login);
      $(document).ready(function () {
        ngInstance.service.sendDeleteUser(ngInstance.dataDeleteAccess).then(res => {
          var str = JSON.stringify(res);
          ngInstance.responseRegister = JSON.parse(str);
          if(str.includes("fallo")){
            Swal.fire(
              'Fallo la eliminacion del usuario!',
              'puede ser que el nombre del usuario no exista o la contraseña se a incorrecta, intenta con datos diferentes por favor.',
              'error'
            );
          }else{
            Swal.fire({
              title: "Se elimino el usuario exitosamente!",
              text: "se ah quitado de la lista automaticamente",
              timer: 2000,
            }).then(function(result) {
              ngInstance.prepareSearch();
            });
          }
        });
      });
    }
}
