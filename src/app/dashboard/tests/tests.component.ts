import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, map } from 'rxjs';
import { Qualification } from 'src/app/entities/qualification';
import { Test } from 'src/app/entities/test';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { QualificationService } from 'src/app/services/qualification.service';
import { TestService } from 'src/app/services/test.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

export interface TestTable {
  id: number;
  name: string;
  qualifications: number;
  qualificationMedia: number | null;
  qualificationUser: number | null;
  qualificationUserDate: string | null;
}

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent {
  public user: User;
  public levelId: number;
  public testsTable: TestTable[] = [];
  public tests: Test[];
  public testsTableReady: boolean = false;
  constructor(private dashboardService: DashboardService, private userService: UserService,
    private testService: TestService, private qualificationService: QualificationService, private _router: Router, private datePipe: DatePipe) { }
  displayedColumns: string[] = ['id', 'name', 'qualifications', 'qualificationMedia', 'qualificationUser', 'qualificationUserDate'];

  ngOnInit(): void {
    let processedTestsCount = 0;
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
          this.testService.getTestsByLevelId(this.levelId).subscribe((data) => {
            this.tests = data;
            if (this.tests.length == 0 || this.tests == null) {
              Swal.fire({
                icon: 'warning',
                title: 'No existen tests',
                text: 'Actualmente no existen tests en AprendeArabe para el nivel seleccionado. Vuelve más tarde o selecciona otro nivel.',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this._router.navigate(['/dashboard/levels']);
                }
              });
            }
            else {
              this.tests.forEach((test) => {
                const $qualificationUser = this.qualificationService.getQualificationByTestIdAndUserId(test.id,this.user.id);
                const $qualificationsTest = this.qualificationService.getQualificationsByTestId(test.id);
                forkJoin([$qualificationUser,$qualificationsTest]).subscribe(([qualificationUser,qualificationsTest]) => {
                  const mediaQualificationsTest: number = this.calculateMediaQualificationsTest(qualificationsTest);
                  const testToAdd: TestTable = {
                    id: test.id,
                    name: test.name,
                    qualifications: qualificationsTest.length,
                    qualificationMedia: mediaQualificationsTest,
                    qualificationUser: (qualificationUser != null) ? qualificationUser.score : null,
                    qualificationUserDate: (qualificationUser != null) ? this.datePipe.transform(qualificationUser.createAt, 'dd-MM-yyyy') : "None"
                  };
                  this.testsTable.push(testToAdd);
                  processedTestsCount++;
                  if (processedTestsCount === this.tests.length) {
                    this.testsTable.sort((a, b) => a.id - b.id);
                    this.testsTableReady = true;
                  }
                });
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

  calculateMediaQualificationsTest(qualifications: Qualification[]): number {
    let media: number = 0;
    let sum: number = 0;
    const len: number = qualifications.length;
    if (qualifications.length != 0) {
      qualifications.forEach((qualification) => {
        sum += qualification.score;
      });
      media = sum / len;
    }
    return media;
  }
}
