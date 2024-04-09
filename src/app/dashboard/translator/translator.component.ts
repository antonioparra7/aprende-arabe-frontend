import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TranslatorService } from 'src/app/services/translator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent {
  public user: User;
  public leftWord: string = "Español";
  public rightWord: string = "Arabe";
  public leftText: string = "";
  public rightText: string = "";

  constructor(private dashboardService: DashboardService, private translatorService: TranslatorService) { }

  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
  }

  change() {
    const leftTemp: string = this.leftWord;
    this.leftWord = this.rightWord;
    this.rightWord = leftTemp;
  }

  checkWord(): boolean {
    let res:boolean = true;
    if(this.leftText == "") {
      res=false;
      Swal.fire("No se ha introducido ningún texto",
        "No ha introducido ningún texto en el cuadro 'Texto a traducir'",
        "error");
    }
    else {
      if(this.leftText.length>64){
        res=false;
        Swal.fire("El texto supera los 64 caracteres",
        "El texto introducido supera la cantidad de 64 caracteres, por lo tanto no puede ser procesado",
        "error");
      }
    }
    return res;
  }

  translate() {
    if (this.checkWord()){
      if (this.leftWord == "Español") {
        this.translatorService.translateEsToAr(this.leftText).pipe(
          tap((translate: string) => {
            this.rightText = translate;
          }),
          catchError((error: HttpErrorResponse) => {
            Swal.fire(`Error ${error.status}`, error.message, 'error');
            throw error;
          })
        ).subscribe();
      }
      else {
        Swal.fire("Traducción árabe a español no disponible actualmente",
          "En estos momentos no se encuentra disponible la traducción de un texto en árabe a español",
          "error");
      }
    }   
  }
}
