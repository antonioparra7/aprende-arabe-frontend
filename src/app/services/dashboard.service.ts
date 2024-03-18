import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../entities/user';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url:string = "http://localhost:8080/api/v1/dashboard";
  private user: User;

  constructor(private http: HttpClient) { }

  getData():Observable<User>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User>(this.url,{ headers }).pipe(
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }

  setUser(user: User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }
}
