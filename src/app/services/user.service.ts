import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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

  getLevelId(id: number):Observable<number>{
    return this.http.get<number>(`${this.url}/levelId/${id}`).pipe(
      catchError((error:HttpErrorResponse) => {
        return throwError(()=>error);
      })
    );
  }

  updateLevelUser(request: any, userId: number): Observable<User> {
    return this.http.put<User>(`${this.url}/${userId}`, request).pipe(
      catchError((error:HttpErrorResponse) => {
        return throwError(()=>error);
      })
    );
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.url}/${id}`,{ responseType: 'text' }).pipe(
      map(response=>{
        return {message: response};
      }),
      catchError((error:HttpErrorResponse) => {
        return throwError(()=>error);
      })
    );
  }
}
