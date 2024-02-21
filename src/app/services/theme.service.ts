import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Theme } from '../entities/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private url:string = "http://localhost:8080/api/v1/themes";
  constructor(private http: HttpClient) { }
  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getThemesByLevelId(id: number): Observable<Theme[]> {
    return this.http.get<Theme[]>(`${this.url}/levelId/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getThemeById(id: number): Observable<Theme> {
    return this.http.get<Theme>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createTheme(name: string, image: File, levelId: number): Observable<string> {
    const body = {
      name: name,
      image: image,
      levelId: levelId
    };

    return this.http.post<string>(this.url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteTheme(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
