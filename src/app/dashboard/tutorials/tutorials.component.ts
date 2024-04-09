import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { Tutorial } from 'src/app/entities/tutorial';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TutorialService } from 'src/app/services/tutorial.service';
import Swal from 'sweetalert2';

export interface TutorialTable {
  name: string;
  description: string;
  link: string;
  tutorialDate: string | null;
}

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.css']
})
export class TutorialsComponent {
  public tutorials: Tutorial[];
  public tutorialsTable: TutorialTable[] = [];
  public user: User;
  public tutorialsTableReady: boolean;
  constructor(private dashboardService: DashboardService, private tutorialService: TutorialService, private datePipe: DatePipe) { }
  displayedColumns: string[] = ['name', 'description', 'tutorialDate'];
  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    this.tutorialService.getTutorials().pipe(
      tap(data => {
        this.tutorials = data;
        this.tutorials.forEach((tutorial) => {
          const tutorialToAdd: TutorialTable = {
            name: tutorial.name,
            description: tutorial.description,
            link: tutorial.link,
            tutorialDate: this.datePipe.transform(tutorial.createAt, 'dd-MM-yyyy')
          }
          this.tutorialsTable.push(tutorialToAdd);
        });
      }),
      catchError((error: HttpErrorResponse) => {
        Swal.fire(`Error ${error.status}`, error.error, 'error');
        throw error;
      })
    ).subscribe(() => {
      this.tutorialsTableReady = true;
    });
  }
}
