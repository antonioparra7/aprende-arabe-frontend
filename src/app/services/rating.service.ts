import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Rating } from '../entities/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private url:string = "http://localhost:8080/api/v1/ratings";
  constructor(private http: HttpClient) { }

  getRatings(): Observable<Rating[]>{
    return this.http.get<Rating[]>(this.url).pipe(
      catchError((error:HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  getRatingsByLessonId(id: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.url}/lessonId/${id}`).pipe(
      catchError((error:HttpErrorResponse) => {
        return throwError(()=>error);
      })
    );
  }
  getRatingsByUserId(id: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.url}/userId/${id}`).pipe(
      catchError((error:HttpErrorResponse) => {
        return throwError(()=>error);
      })
    );
  }
  getRatingByLessonIdAndUserId(lessonId: number, userId: number): Observable<Rating> {
    return this.http.get<Rating>(`${this.url}/lessonId/${lessonId}/userId/${userId}`).pipe(
      catchError((error:HttpErrorResponse) => {
        return throwError(()=>error);
      })
    );
  }
  getRatingById(id: number){
    return this.http.get<Rating>(`${this.url}/${id}`).pipe(
      catchError((error:HttpErrorResponse) => {
        return throwError(()=>error);
      })
    );
  }
  createRating(request:any): Observable<any> {
    return this.http.post<string>(this.url, request,{ responseType: 'text' as 'json'}).pipe(
      map(response=>{
          return {message: response};
        }
      ),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteRating(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

}
