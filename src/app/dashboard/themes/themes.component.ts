import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs';
import { Level } from 'src/app/entities/level';
import { Theme } from 'src/app/entities/theme';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css']
})
export class ThemesComponent implements OnInit {
  public user: User;
  public levelId: number;
  public themes: Theme[];

  constructor(private dashboardService: DashboardService, private themeService: ThemeService, private userService: UserService, private _router: Router) { }
  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    // obtener nivel (si no hay redireccionar a seccion de niveles)
    this.userService.getLevelId(this.user.id).pipe(
      map(levelId => {
        this.levelId = levelId;
        if (this.levelId == null) {
          // Muestra una alerta SweetAlert si levelId es undefined
          Swal.fire({
            icon: 'warning',
            title: '¡No has seleccionado ningún nivel!',
            text: 'No se ha seleccionado ningún nivel. Selecciona uno y vuelve.',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/dashboard/levels']);
            }
          });
        }
        else {

          this.themeService.getThemesByLevelId(this.levelId).subscribe((data) => {
            this.themes = data;
            if (this.themes.length == 0) {
              Swal.fire({
                icon: 'warning',
                title: 'No existen temáticas',
                text: 'Actualmente no existen temáticas en AprendeArabe para el nivel seleccionado. Vuelve más tarde o selecciona otro nivel.',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this._router.navigate(['/dashboard/levels']);
                }
              });
            }
          });

        }
      }),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    ).subscribe();
  }
  getImageSrc(imageData: any): string {
    return `data:image/png;base64,${imageData}`;
  }
  lessonsOfTheme(themeId: number) {
    const url = `/dashboard/lessons/${themeId}`;
    this._router.navigateByUrl(url);
  }
}
