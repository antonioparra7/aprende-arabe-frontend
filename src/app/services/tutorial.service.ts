import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tutorial } from '../entities/tutorial';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private url:string = "http://localhost:8080/api/v1/tutorials";
  constructor(private http: HttpClient) { }
  getTutorials(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getTutorialById(id: number): Observable<Tutorial> {
    return this.http.get<Tutorial>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getTutorialByLink(link: string): Observable<Tutorial> {
    return this.http.get<Tutorial>(`${this.url}/link/${link}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createTutorial(name: string, description: string, link: string, destinedTo: string): Observable<string> {
    const body = {
      name: name,
      description: description,
      link: link,
      destinedTo: destinedTo
    };

    return this.http.post<string>(this.url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteTutorial(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
