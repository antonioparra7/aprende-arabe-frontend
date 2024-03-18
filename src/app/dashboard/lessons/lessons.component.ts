import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, switchMap } from 'rxjs';
import { Lesson } from 'src/app/entities/lesson';
import { Rating } from 'src/app/entities/rating';
import { Theme } from 'src/app/entities/theme';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LessonService } from 'src/app/services/lesson.service';
import { RatingService } from 'src/app/services/rating.service';
import { ThemeService } from 'src/app/services/theme.service';
import Swal from 'sweetalert2';

export interface LessonTable {
  id: number;
  name: string;
  ratings: number;
  ratingMedia: number | null;
  ratingUser: number | null;
  ratingUserDate: string | null;
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent {
  public user: User;
  public themeId: number;
  public theme: Theme;
  public lessonsTable: LessonTable[] = [];
  public lessons: Lesson[];
  public lessonsTableReady: boolean = false;
  constructor(private route: ActivatedRoute, private dashboardService: DashboardService,
    private lessonService: LessonService, private themeService: ThemeService,
    private ratingService: RatingService, private _router: Router, private datePipe: DatePipe) { }
  displayedColumns: string[] = ['id', 'name', 'ratings', 'ratingMedia', 'ratingUser', 'ratingUserDate'];

  ngOnInit(): void {
    let processedLessonsCount = 0;
    
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
            if (this.lessons.length == 0 || this.lessons == null) {
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
            else {
              this.lessons.forEach((lesson, index) => {
                const $ratingUser = this.ratingService.getRatingByLessonIdAndUserId(lesson.id, this.user.id);
                const $ratingsLesson = this.ratingService.getRatingsByLessonId(lesson.id);
                forkJoin([$ratingUser, $ratingsLesson]).subscribe(([ratingUser, ratingsLesson]) => {
                  const mediaRatingsLesson: number = this.calculateMediaRatingsLesson(ratingsLesson);
                  const lessonToAdd: LessonTable = {
                    id: lesson.id,
                    name: lesson.name,
                    ratings: ratingsLesson.length,
                    ratingMedia: mediaRatingsLesson,
                    ratingUser: (ratingUser != null) ? ratingUser.score : null,
                    ratingUserDate: (ratingUser != null) ? this.datePipe.transform(lesson.createAt, 'dd-MM-yyyy') : "None"
                  };
                  this.lessonsTable.push(lessonToAdd);
                  processedLessonsCount++;
                  if (processedLessonsCount === this.lessons.length) {
                    this.lessonsTable.sort((a, b) => a.id - b.id);
                    this.lessonsTableReady = true;
                  }
                });
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

  calculateMediaRatingsLesson(ratings: Rating[]): number {
    let media: number = 0;
    let sum: number = 0;
    const len: number = ratings.length;
    if (ratings.length != 0) {
      ratings.forEach((rating) => {
        sum += rating.score;
      });
      media = sum / len;
    }
    return media;
  }
}
