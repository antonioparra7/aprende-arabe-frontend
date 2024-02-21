import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Content } from '../entities/content';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private url:string = "http://localhost:8080/api/v1/contents";
  constructor(private http: HttpClient) { }
  getContents(): Observable<Content[]> {
    return this.http.get<Content[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getContentById(id: number): Observable<Content> {
    return this.http.get<Content>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createContent(word: string, wordTranslate: string, image: File, lessonId: number): Observable<string> {
    const body = {
      word: word,
      wordTranslate: wordTranslate,
      image: image,
      lessonId: lessonId
    };

    return this.http.post<string>(this.url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteContent(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
