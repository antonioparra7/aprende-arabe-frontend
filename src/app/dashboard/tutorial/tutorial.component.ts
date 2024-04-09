import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { Tutorial } from 'src/app/entities/tutorial';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TutorialService } from 'src/app/services/tutorial.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent {
  public user: User;
  public tutorial: Tutorial;
  public tutorialIsReady: boolean = false;
  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private tutorialService: TutorialService, private _router: Router) { }
  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    this.route.params.subscribe(params => {
      const linkUrl = params['link'];
      this.tutorialService.getTutorialByLink(linkUrl).pipe(
        map(data => {
          this.tutorial = data;
        }),
        catchError((error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: `Error ${error.status}`,
            text: error.error,
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/dashboard/tutorials']);
            }
          });
          throw error;
        }),
      ).subscribe(() => {
        this.tutorialIsReady = true;
      });
    })
  }
}
