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
  banOpenSearch=false;
  responseSearch: any;
  usuario;
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
      this.usuario = localStorage.getItem("usuario");
      console.log("usuario obtenido:::::::::: "+this.usuario);
    }
    ngOnInit() {
      this.prepareSearch();
      $(document).ready(function () {
        console.log("cargando javascript:::::::");
        $('.datepicker').datepicker(); 
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
    goManage() {
      this.router.navigateByUrl('/manage');
    }
    goHome() {
      this.router.navigateByUrl('/home');
    }
    goLogin() {
      this.router.navigateByUrl('/login');
    }
    goPapers(){
      this.router.navigateByUrl('/papers');
    }
    openSearch(){
      this.banOpenSearch=this.banOpenSearch==false ? true : false;
      var txt="";
      txt= this.banOpenSearch == false ? "+" : "-";
      $('#btnOpenSearch').text(txt); 
    }
    goCloseSession() {
      console.log("cerrando sesión:::::::");
      localStorage.removeItem('usuario');
      location.reload();
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
                  
                  for (let usr in ngInstance.data) {
                    console.log(ngInstance.data[usr].FECHAALTA);
                    var date = new Date(ngInstance.data[usr].FECHAALTA);
                    // Get year, month, and day part from the date
                    var year = date.toLocaleString("default", { year: "numeric" });
                    var month = date.toLocaleString("default", { month: "2-digit" });
                    var day = date.toLocaleString("default", { day: "2-digit" });
                    // Generate yyyy-mm-dd date string
                    /* var formattedDate = year + "-" + month + "-" + day; */
                    var formattedDate = day + "-" + month + "-" + year;
                    console.log("fecha formada desde tabla:::::::::::::::::::::::");
                    console.log(formattedDate);
                    ngInstance.data[usr].FECHAALTA=formattedDate;
                  }
                  console.log(ngInstance.data);
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
                      for (let usr in ngInstance.data) {
                        console.log(ngInstance.data[usr].FECHAALTA);
                        var date = new Date(ngInstance.data[usr].FECHAALTA);
                        // Get year, month, and day part from the date
                        var year = date.toLocaleString("default", { year: "numeric" });
                        var month = date.toLocaleString("default", { month: "2-digit" });
                        var day = date.toLocaleString("default", { day: "2-digit" });
                        // Generate yyyy-mm-dd date string
                        /* var formattedDate = year + "-" + month + "-" + day; */
                        var formattedDate = day + "-" + month + "-" + year;
                        console.log("fecha formada desde tabla:::::::::::::::::::::::");
                        console.log(formattedDate);
                        ngInstance.data[usr].FECHAALTA=formattedDate;
                      }
                      console.log(ngInstance.data);
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
              'Fallo la búsqueda de usuarios!',
              'Intenta con algún nombre real de usuario, este debe ser el nombre de una persona .',
              'error'
            );
          }else{
            Swal.fire({
              title: "Datos obtenidos!",
              text: "se cargaron los datos de usuarios",
              timer: 1000,
            }).then(function(result) {
              for (let usr in ngInstance.data) {
                console.log(ngInstance.data[usr].FECHAALTA);
                var date = new Date(ngInstance.data[usr].FECHAALTA);
                // Get year, month, and day part from the date
                var year = date.toLocaleString("default", { year: "numeric" });
                var month = date.toLocaleString("default", { month: "2-digit" });
                var day = date.toLocaleString("default", { day: "2-digit" });
                // Generate yyyy-mm-dd date string
                /* var formattedDate = year + "-" + month + "-" + day; */
                var formattedDate = day + "-" + month + "-" + year;
                console.log("fecha formada desde tabla:::::::::::::::::::::::");
                console.log(formattedDate);
                ngInstance.data[usr].FECHAALTA=formattedDate;
              }
              console.log(ngInstance.data);
            });
          }
        });
      });
    }
}
