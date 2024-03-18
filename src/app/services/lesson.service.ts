import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Lesson } from '../entities/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private url:string = "http://localhost:8080/api/v1/lessons";
  constructor(private http: HttpClient) { }
  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getLessonsByThemeId(id: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.url}/themeId/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  getLessonById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createLesson(name: string, themeId: number): Observable<string> {
    const body = {
      name: name,
      themeId: themeId
    };

    return this.http.post<string>(this.url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteLesson(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
