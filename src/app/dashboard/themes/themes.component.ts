import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css']
})
export class ThemesComponent implements OnInit {
  ngOnInit(): void {
    Swal.fire({
      icon:'error',
      title:'Selecciona un nivel',
      text:'Debes seleccionar un nivel en la pestaña Niveles'
    });
  }
}
