import { Component, OnInit } from '@angular/core';
import { Level } from 'src/app/entities/level';
import { LevelService } from 'src/app/services/level.service';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/services/dashboard.service';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/user.service';
import { catchError, map, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {

  public levels: Level[];
  public user: User;
  public levelId: number;

  constructor(private dashboardService: DashboardService, private levelService: LevelService, private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    this.userService.getLevelId(this.user?.id).pipe(
      tap((levelId: number) => {
        this.levelId = levelId;
      }),
      catchError((error) => {
        throw error;
      })
    ).subscribe();
    this.levelService.getLevels().subscribe((data) => {
      this.levels = data;
      if (this.levels.length == 0) {
        Swal.fire("No existen niveles", "Actualmente no existen niveles en AprendeArabe. Vuelve más tarde.", 'error');
      }
    });
  }

  getImageSrc(imageData: any): string {
    return `data:image/png;base64,${imageData}`;
  }

  selectLevel(level: Level) {
    const request = { 'levelId': level.id };
    this.userService.updateLevelUser(request, this.user?.id).pipe(
      tap((user: User) => {
        this.levelId = level.id;
        Swal.fire('Nivel seleccionado con éxito', `Ya puedes disfrutar de las diferentes temáticas y lecciones del nivel ${level.name} en AprendeArabe`, 'success');
      }),
      catchError((error) => {
        Swal.fire(`Error al seleccionar nivel ${level.name}`, error, 'error');
        throw error;
      })
    ).subscribe();
    this.dashboardService.getData().pipe(
      map(user => {
        this.user = user;
        this.dashboardService.setUser(user);
        localStorage.setItem('user', JSON.stringify(this.user));
      }),
      catchError((error: HttpErrorResponse) => {
        Swal.fire(`Error ${error.status}`, error.message, 'error');
        throw error;
      })
    ).subscribe();
  }
}
