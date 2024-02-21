import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { User } from '../entities/user';
import { catchError, finalize, map, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public user: User;
  public loading:boolean;

  constructor(private dashboardService: DashboardService, private _router: Router, private authenticationService: AuthenticationService, private statisticsService: StatisticsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    configureSidebar();
    setTimeout(() => {
      this.authenticationService.setIsLogged(true);
      this.cdr.detectChanges();
    });
    this.load();
  }
  getImageSrc(imageData: any): string {
    return `data:image/png;base64,${imageData}`;
  }
  load() {
    this.loading=true;
    this.dashboardService.getData().pipe(
      map(user => {
        this.user = user;
        this.dashboardService.setUser(user);
        localStorage.setItem('user', JSON.stringify(this.user));
      }),
      catchError((error: HttpErrorResponse) => {
        Swal.fire(`Error ${error.status}`, error.message, 'error');
        throw error;
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }
  logout(){
    localStorage.removeItem('token');
    this.authenticationService.setIsLogged(false);
    this._router.navigate(['/dashboard']);
  }
}



function configureSidebar() {
  const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
  sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
      sideLinks.forEach(i => {
        i.parentElement?.classList.remove('active');
      });
      li?.classList.add('active');
    });
  });
  const menuBar = document.querySelector('.content nav .bx.bx-menu');
  const sideBar = document.querySelector('.sidebar');
  menuBar?.addEventListener('click', () => {
    sideBar?.classList.toggle('close');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      sideBar?.classList.add('close');
    }
    else {
      sideBar?.classList.remove('close');
    }
  });


}

