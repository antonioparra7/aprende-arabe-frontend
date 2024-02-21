import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs';
import { Lesson } from 'src/app/entities/lesson';
import { Theme } from 'src/app/entities/theme';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LessonService } from 'src/app/services/lesson.service';
import { ThemeService } from 'src/app/services/theme.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent {
  public user: User;
  public themeId: number;
  public theme: Theme;
  public lessons: Lesson[];
  constructor(private route: ActivatedRoute, private dashboardService: DashboardService,
    private lessonService: LessonService, private themeService: ThemeService,
    private _router: Router, private datePipe: DatePipe) { }
  displayedColumns: string[] = ['id', 'name', 'createAt'];

  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    // obtener parametro de url y comprobar que es correcto
    this.route.params.subscribe(params => {
      const themeIdUrl = params['themeId'];
      if (!isNaN(themeIdUrl)) {
        this.themeId = +themeIdUrl;
        this.themeService.getThemeById(this.themeId).pipe(
          switchMap(data => {
            this.theme = data;
            return this.lessonService.getLessonsByThemeId(this.themeId);
          }),
          catchError((error: HttpErrorResponse) => {
            Swal.fire(`Error ${error.status}`, error.message, 'error');
            this._router.navigate(['/dashboard/themes']);
            throw error;
          })
        ).subscribe(
          data => {
            this.lessons = data;
            if (this.lessons.length == 0) {
              Swal.fire({
                icon: 'warning',
                title: '¡No existen lecciones para esta temática!',
                text: 'Actualmente no hay lecciones disponibles para esta temática',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this._router.navigate(['/dashboard/themes']);
                }
              });
            }
          }
        );
      }
      else {
        // si en la url no se proporciona un id en formato correcto redirige a Tematicas
        Swal.fire({
          icon: 'error',
          title: '¡Id no válido!',
          text: 'El id proporcionado no tiene el formato correcto.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this._router.navigate(['/dashboard/themes']);
          }
        });
      }
    })
  }
}
