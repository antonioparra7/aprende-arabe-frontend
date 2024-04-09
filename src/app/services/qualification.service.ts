import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Qualification } from '../entities/qualification';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {
  private url:string = "http://localhost:8080/api/v1/qualifications";
  constructor(private http: HttpClient) { }

  getQualifications(): Observable<Qualification[]> {
    return this.http.get<Qualification[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getQualificationsByTestId(id: number): Observable<Qualification[]> {
    return this.http.get<Qualification[]>(`${this.url}/testId/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getQualificationsByUserId(id: number): Observable<Qualification[]> {
    return this.http.get<Qualification[]>(`${this.url}/userId/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getQualificationByTestIdAndUserId(testId: number, userId: number): Observable<Qualification> {
    return this.http.get<Qualification>(`${this.url}/testId/${testId}/userId/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getQualificationById(id: number): Observable<Qualification> {
    return this.http.get<Qualification>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createQualification(request:any): Observable<any> {
    return this.http.post(this.url, request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  updateQualification(request:any): Observable<any> {
    return this.http.put(this.url, request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteQualification(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
