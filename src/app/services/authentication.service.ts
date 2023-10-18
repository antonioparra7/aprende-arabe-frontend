import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url:string = 'http://localhost:8080/api/v1/auth';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  private isLoggedSubject = new BehaviorSubject<boolean>(false);
  isLogged$ = this.isLoggedSubject.asObservable();
  
  constructor(private http:HttpClient) { }

  register(request:any):Observable<any>{
    return this.http.post(this.url + "/register", request, { headers: this.headers, responseType: 'text' }).pipe(
      map((response: string) => {
        const jsonResponse = JSON.parse(response);
        return jsonResponse.token;
      }),
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }

  authenticate(request:any):Observable<any>{
    return this.http.post(this.url + "/authenticate", request, {headers: this.headers, responseType: 'text' }).pipe(
      map((response: string) => {
        const jsonResponse = JSON.parse(response);
        return jsonResponse.token;
      }),
      catchError((error:HttpErrorResponse) => {
        return throwError(()=>error);
      })
    );
  }

  setIsLogged(isLogged: boolean): void {
    this.isLoggedSubject.next(isLogged);
  }
}
