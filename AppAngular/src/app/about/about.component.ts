import { Component,OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalServiceService } from '../local.service.service';

declare var $: any;
@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit{
  usuario;
  constructor(
    private service: LocalServiceService,
    private router: Router
    ) {
      this.usuario = localStorage.getItem("usuario");
      //////console.log("usuario obtenido:::::::::: "+this.usuario);
    }
    ngOnInit() {
      $(document).ready(function () {
        console.log("cargando javascript:::::::");
       
      });
    }
}
