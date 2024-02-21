import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Question } from '../entities/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private url:string = "http://localhost:8080/api/v1/questions";
  constructor(private http: HttpClient) { }
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getQuestionsByTestId(id: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.url}/testId/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createQuestion(question: string, responseA: string, responseB: string, responseC: string, responseD: string, responseCorrect: string, image: File, testId: number): Observable<string> {
    const body = {
      question: question,
      responseA: responseA,
      responseB: responseB,
      responseC: responseC,
      responseD: responseD,
      responseCorrect: responseCorrect,
      image: image,
      testId: testId
    };

    return this.http.post<string>(this.url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteQuestion(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
