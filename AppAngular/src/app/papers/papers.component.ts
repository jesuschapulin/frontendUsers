import { Component, OnInit, AfterViewInit,OnDestroy  } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LocalServiceService } from '../local.service.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-papers',
  standalone: false,
  templateUrl: './papers.component.html',
  styleUrl: './papers.component.css'
})
export class PapersComponent implements OnInit{
  usuario;
  data: any;
  constructor(
    private service: LocalServiceService,
    private router: Router
    ) {
      this.usuario = localStorage.getItem("usuario");
      console.log("usuario obtenido:::::::::: "+this.usuario);
    }
    ngOnInit() {
      this.getDataRedis();
      $(document).ready(function () {
        console.log("cargando javascript de papers:::::::");
        $(".viweActive").attr("Style","background-color: lightgrey");
      });
      if(this.usuario=="" || this.usuario==undefined){
        console.log("No se identifico el usuario:::::::"+this.usuario );
        this.goLogin();
      }
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
    goPapers(){
      this.router.navigateByUrl('/papers');
    }
    goCloseSession() {
      console.log("cerrando sesión:::::::");
      localStorage.removeItem('usuario');
      location.reload();
    }
    getDataRedis(){
    var ngInstance=this;
    console.log("cargando data papers:::::::");
    ngInstance.service.getDataRedis().then(res => {
      var str = JSON.stringify(res.data);
      ngInstance.data = JSON.parse(str);
      console.log(ngInstance.data);
      console.log("cerrando papers:::::::");
    }).catch(error => {
      console.log(error);
    });;
  }
}
