import { Component,OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalServiceService } from '../local.service.service';
declare var $: any;
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  data: any;
  responseSearch: any;
  dataSearchAccess = {
    "FECHA1": "",
    "FECHA2": "",
    "NOMBRE": "",
    "STATUS": ""
  };
  constructor(
    private service: LocalServiceService,
    private router: Router
    ) {
      
    }
    ngOnInit() {
      this.prepareSearch();
      $(document).ready(function () {
        console.log("cargando javascript:::::::");
        $('.datepicker').datepicker(); 
        $(".viweActive").attr("Style","background-color: lightgrey");
      });
    }
    prepareSearch() {
      console.log("cadena a buscar en home:::::::");
      this.service.getInfoFilters().then(res => {
        var str = JSON.stringify(res);
        this.data = JSON.parse(str);
        console.log(this.data);

      });
    }
    goManage() {
      this.router.navigateByUrl('/manage');
    }
    goHome() {
      this.router.navigateByUrl('/home');
    }
    searchUser() {
      var ngInstance=this;
      console.log("cadena a buscar::::::: "+ngInstance.dataSearchAccess.NOMBRE);
      var date=$('#formSearchFec1').val(); 
      ngInstance.dataSearchAccess.FECHA1=""+date;
      var date2=$('#formSearchFec2').val(); 
      ngInstance.dataSearchAccess.FECHA2=""+date2;
      console.log("dates a buscar::::::: "+date);
      
      $(document).ready(function () {
          if(ngInstance.dataSearchAccess.FECHA1!="" && ngInstance.dataSearchAccess.FECHA2!="" && ngInstance.dataSearchAccess.NOMBRE==""){
          var formattedDate = ngInstance.dataSearchAccess.FECHA1.split("-")[2] +
                          "-" + ngInstance.dataSearchAccess.FECHA1.split("-")[1] +
                          "-" + ngInstance.dataSearchAccess.FECHA1.split("-")[0];
          console.log(formattedDate);
          ngInstance.dataSearchAccess.FECHA1=formattedDate;

          var formattedDate = ngInstance.dataSearchAccess.FECHA2.split("-")[2] +
                          "-" + ngInstance.dataSearchAccess.FECHA2.split("-")[1] +
                          "-" + ngInstance.dataSearchAccess.FECHA2.split("-")[0];
          console.log(formattedDate);
          ngInstance.dataSearchAccess.FECHA2=formattedDate;


            console.log("objeto a buscar::::::: ");
            console.log(ngInstance.dataSearchAccess);
            ngInstance.service.getDataUsersByDate(ngInstance.dataSearchAccess).then(res => {
              var str = JSON.stringify(res);
              ngInstance.data = JSON.parse(str);
              console.log(ngInstance.data);
              if(ngInstance.data.length==0){
                Swal.fire(
                  'Fallo la busqueda de usuarios por fecha de alta!',
                  'Intenta con algun nombre real de usuario, este debe ser el nombre de una persona .',
                  'error'
                );
              }else{
                Swal.fire({
                  title: "Datos obtenidos!",
                  text: "se cargaron los datos de usuarios por fecha",
                  timer: 1000,
                }).then(function(result) {
                });
              }
            });
            }else {
                ngInstance.service.getDataUsersByName(ngInstance.dataSearchAccess).then(res => {
                  var str = JSON.stringify(res);
                  ngInstance.data = JSON.parse(str);
                  console.log(ngInstance.data);
                  ngInstance.responseSearch = JSON.parse(str);
                  console.log(ngInstance.data.length);
                  if(ngInstance.data.length==0){
                    Swal.fire(
                      'Fallo la busqueda de usuarios!',
                      'Intenta con algun nombre real de usuario, este debe ser el nombre de una persona .',
                      'error'
                    );
                  }else{
                    Swal.fire({
                      title: "Datos obtenidos!",
                      text: "se cargaron los datos de usuarios",
                      timer: 1000,
                    }).then(function(result) {
                    });
                  }
                });
              }
      });
    }
    searchUserByStatus(status:String) {
      var ngInstance=this;
      ngInstance.dataSearchAccess.STATUS=""+status;
      console.log("cadena a buscar::::::: "+ngInstance.dataSearchAccess.STATUS);
      $(document).ready(function () {
        ngInstance.service.getDataUsersByStatus(ngInstance.dataSearchAccess).then(res => {
          var str = JSON.stringify(res);
          ngInstance.data = JSON.parse(str);
          console.log(ngInstance.data);
          if(ngInstance.data.length==0){
            Swal.fire(
              'Fallo la busqueda de usuarios!',
              'Intenta con algun nombre real de usuario, este debe ser el nombre de una persona .',
              'error'
            );
          }else{
            Swal.fire({
              title: "Datos obtenidos!",
              text: "se cargaron los datos de usuarios",
              timer: 1000,
            }).then(function(result) {
            });
          }
        });
      });
    }
}
