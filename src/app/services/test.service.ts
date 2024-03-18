import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Test } from '../entities/test';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private url:string = "http://localhost:8080/api/v1/tests";
  constructor(private http: HttpClient) { }
  getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getTestsByLevelId(id: number): Observable<Test[]> {
    return this.http.get<Test[]>(`${this.url}/levelId/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getTestById(id: number): Observable<Test> {
    return this.http.get<Test>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createTest(name: string, image: File, lessonId: number): Observable<string> {
    const body = {
      name: name,
      image: image,
      lessonId: lessonId
    };

    return this.http.post<string>(this.url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteTest(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
