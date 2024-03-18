import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/entities/lesson';
import { Theme } from 'src/app/entities/theme';
import { User } from 'src/app/entities/user';
import { LessonService } from 'src/app/services/lesson.service';
import { DashboardComponent } from '../dashboard.component';
import { DashboardService } from 'src/app/services/dashboard.service';
import Swal from 'sweetalert2';
import { catchError, map, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ContentService } from 'src/app/services/content.service';
import { Content } from 'src/app/entities/content';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent {
  public user: User;
  public lessonId: number;
  public lesson: Lesson;
  public contents: Content[];
  public contentsReady: boolean = false;
  public index: number = 0;
  constructor(private route: ActivatedRoute, private dashboardService: DashboardService,
    private lessonService: LessonService, private contentService: ContentService, private _router: Router) { }
  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    this.route.params.subscribe(params => {
      const lessonIdUrl = params['lessonId'];
      if (!isNaN(lessonIdUrl)) {
        this.lessonId = +lessonIdUrl;
        this.lessonService.getLessonById(this.lessonId).pipe(
          switchMap(data => {
            this.lesson = data;
            return this.contentService.getContentsByLessonId(this.lesson.id);
          }),
          catchError((error: HttpErrorResponse) => {
            Swal.fire(`Error ${error.status}`, error.message, 'error');
            this._router.navigate(['/dashboard/themes']);
            throw error;
          })
        ).subscribe(data => {
          this.contents = data;
          if (this.contents.length == 0) {
            Swal.fire({
              icon: 'error',
              title: '¡No hay contenido para esta lección!',
              text: 'La lección no tiene contenido disponible para mostrar. Vuelva más tarde!',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this._router.navigate(['/dashboard/themes']);
              }
            });
          }
          else {
            this.contentsReady = true;
          }
        });
      }
      else {
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
    });
  }
  getImageSrc(imageData: any): string {
    return `data:image/png;base64,${imageData}`;
  }
  lastContent() {
    this.index -= 1;
  }
  nextContent() {
    this.index += 1;
  }
  finish() {
    console.log("Lección terminada")
  }

}
