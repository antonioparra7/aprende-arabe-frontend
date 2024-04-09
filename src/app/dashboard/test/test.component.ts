import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs';
import { Qualification } from 'src/app/entities/qualification';
import { Question } from 'src/app/entities/question';
import { Test } from 'src/app/entities/test';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { QualificationService } from 'src/app/services/qualification.service';
import { QuestionService } from 'src/app/services/question.service';
import { TestService } from 'src/app/services/test.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  public start: boolean = false;
  public testReady: boolean = false;
  public user: User;
  public testId: number;
  public test: Test;
  public imageRandom: Uint8Array;
  public questions: Question[];
  public questionsTest: string[][] = [];
  public response: string = '';
  public index: number = 0;
  public aciertos: number = 0;
  public qualification: Qualification;

  constructor(private dashboardService: DashboardService, private testService: TestService,
    private questionService: QuestionService, private qualificationService: QualificationService,
    private route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    this.route.params.subscribe(params => {
      const themeIdUrl = params['testId'];
      if (!isNaN(themeIdUrl)) {
        this.testId = +themeIdUrl;
        this.testService.getTestById(this.testId).pipe(
          switchMap(data => {
            this.test = data;
            return this.questionService.getQuestionsByTestId(this.testId);
          }),
          catchError((error: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              title: `Error ${error.status}`,
              text: error.error,
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this._router.navigate(['/dashboard/tests']);
              }
            });
            throw error;
          })
        ).subscribe(
          data => {
            this.questions = data;
            if (this.questions.length == 0 || this.questions == null) {
              Swal.fire({
                icon: 'warning',
                title: '¡No existen preguntas para este test!',
                text: 'Actualmente no hay preguntas disponibles para este test',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this._router.navigate(['/dashboard/test']);
                }
              });
            }
            else {
              this.imageRandom = this.questions[Math.floor(Math.random() * this.questions.length)].image;
              this.questions.forEach(question => {
                let array = [question.responseA, question.responseB, question.responseC, question.responseD];
                this.questionsTest.push(array);
              });
              this.testReady = true;
            }

          }
        );
      }
      else {
        Swal.fire({
          icon: 'error',
          title: '¡Id no válido!',
          text: 'El id proporcionado no tiene el formato correcto.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this._router.navigate(['/dashboard/tests']);
          }
        });
      }
    })
  }

  startTest() {
    this.start = true;
  }

  lastQuestion() {
    this.index -= 1;
  }

  nextQuestion() {
    switch (this.questions[this.index].responseCorrect) {
      case "A":
        if (this.questionsTest[this.index][0] === this.response) {
          this.aciertos += 1;
        }
        break;
      case "B":
        if (this.questionsTest[this.index][1] === this.response) {
          this.aciertos += 1;
        }
        break;
      case "C":
        if (this.questionsTest[this.index][2] === this.response) {
          this.aciertos += 1;
        }
        break;
      case "D":
        if (this.questionsTest[this.index][3] === this.response) {
          this.aciertos += 1;
        }
        break;
    }
    this.index += 1;
  }

  finishTest() {
    let nota = (this.aciertos / this.questions.length) * 10;
    nota = Math.round(nota * 10) / 10;
    this.qualificationService.getQualificationByTestIdAndUserId(this.testId,this.user.id).pipe(
      switchMap(data => {
        const request = {
          score: nota,
          testId: this.testId,
          userId: this.user.id
        }
        if(data === null){
          return this.qualificationService.createQualification(request);
        }
        else {
          return this.qualificationService.updateQualification(request);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        Swal.fire(`Error ${error.status}`, error.message, 'error');
        this._router.navigate(['/dashboard/themes']);
        throw error;
      })
    ).subscribe(
      response => {
        console.log(response);
        const qualification:Qualification = response; 
        if (qualification.score >= 5.0) {
          Swal.fire({
            icon: 'success',
            title: '¡Ha aprobado el test!',
            text: `Su calificación es de ${nota}, por lo tanto ha aprobado el test`,
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/dashboard/tests']);
            }
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: '¡No ha aprobado el test!',
            text: `Su calificación es de ${nota}, por lo tanto no ha aprobado el test. Intentalo más tarde`,
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/dashboard/tests']);
            }
          });
        }
      }
    );
  }

  getImageSrc(imageData: any): string {
    return `data:image/png;base64,${imageData}`;
  }
}
