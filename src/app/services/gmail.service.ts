import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GmailService {
  private url:string = "http://localhost:8080/api/v1/gmail";
  constructor(private http: HttpClient) { }
  sendEmail(request:any): Observable<any> {
    return this.http.post(`${this.url}/sendEmail`, request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
