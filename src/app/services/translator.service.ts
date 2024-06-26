import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  private url:string = "http://localhost:8080/api/v1/translator";
  constructor(private http: HttpClient) { }
  translateEsToAr(text:string){
    const body = {
      text: text
    }
    return this.http.post<string>(`${this.url}/es-ar`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
