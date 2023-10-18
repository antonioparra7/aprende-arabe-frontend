import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url:string = 'http://localhost:8080/api/v1/users';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http:HttpClient) { }

  checkExistsUserByUsername(username:string):Observable<boolean>{
    return this.http.get<User>(`${this.url}/username/${username}`).pipe(
      map(user => true), 
      catchError(error => {
          return of(false);
      })
    );
  }

  checkExistsUserByEmail(email:string):Observable<boolean>{
    return this.http.get<User>(`${this.url}/email/${email}`).pipe(
      map(user => true), 
      catchError(error => {
          return of(false);
      })
    );
  }
}
