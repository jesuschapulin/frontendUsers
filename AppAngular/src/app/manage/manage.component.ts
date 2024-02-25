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
  dataUser = {
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
        for (let usr in this.data) {
          var date = new Date(this.data[usr].FECHAALTA+" 00:00:00");
          var date2 = new Date(this.data[usr].FECHA_VIGENCIA+" 00:00:00");
          this.data[usr].FECHAALTA=this.formateData(""+date);
          this.data[usr].FECHA_VIGENCIA=this.formateData(""+date2);
          this.data[usr].FECHAREVOCADO= 
              (this.data[usr].FECHAREVOCADO!="" && this.data[usr].FECHAREVOCADO!=null) ? this.formateData(""+new Date(this.data[usr].FECHAREVOCADO+" 00:00:00")) : "";
          console.log(this.data[usr]);
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
      ngInstance.dataUser.LOGIN=""+login;
      ngInstance.dataUser.NOMBRE=""+nombre;
      console.log("cadena a mandar en eliminacion:::::::"+login);
      $(document).ready(function () {
        ngInstance.service.sendDeleteUser(ngInstance.dataUser).then(res => {
          var str = JSON.stringify(res);
          ngInstance.responseRegister = JSON.parse(str);
          if(str.includes("fallo")){
            Swal.fire(
              'Fallo la eliminación del usuario!',
              'puede ser que el nombre del usuario no exista',
              'error'
            );
          }else{
            Swal.fire({
              title: "Se elimino el usuario exitosamente!",
              text: "se ah quitado de la lista automáticamente",
              timer: 2000,
            }).then(function(result) {
              ngInstance.prepareSearch();
            });
          }
        });
      });
    }
    inactiveUser(login: String, nombre: String) {
      var ngInstance=this;
      ngInstance.dataUser.LOGIN=""+login;
      ngInstance.dataUser.NOMBRE=""+nombre;
      console.log("cadena a mandar en inactivacion:::::::"+login);
      $(document).ready(function () {
        ngInstance.service.sendInactiveUser(ngInstance.dataUser).then(res => {
          var str = JSON.stringify(res);
          ngInstance.responseRegister = JSON.parse(str);
          if(str.includes("fallo")){
            Swal.fire(
              'Fallo la inactivación del usuario!',
              'puede ser que el nombre del usuario no exista',
              'error'
            );
          }else{
            Swal.fire({
              title: "Se inactivo el usuario exitosamente!",
              text: "se ha restringido el acceso automáticamente",
              timer: 2000,
            }).then(function(result) {
              ngInstance.prepareSearch();
            });
          }
        });
      });
    }
}
