import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Level } from '../entities/level';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private url:string = "http://localhost:8080/api/v1/levels";
  constructor(private http: HttpClient) { }
  getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getLevelById(id: number): Observable<Level> {
    return this.http.get<Level>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createLevel(name: string, image: File): Observable<string> {
    const body = {
      name: name,
      image: image
    };

    return this.http.post<string>(this.url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteLevel(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}