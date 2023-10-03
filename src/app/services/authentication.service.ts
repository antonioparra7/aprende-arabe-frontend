import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url:string = 'http://localhost:8080/api/v1/auth';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  
  constructor(private http:HttpClient) { }

  register(request:any):Observable<any>{
    console.log('FUNCION SERVICIO');
    return this.http.post(this.url + "/register", request, { headers: this.headers, responseType: 'text' }).pipe(
      map((response: string) => {
        const jsonResponse = JSON.parse(response);
        console.log(jsonResponse.token);
        return jsonResponse.token;
      }),
      catchError((error) => {
        console.error('Error al enviar la solicitud POST:', error);
        return throwError(() => new Error('Error al registrar al usuario'));
      })
    );
  }
}
