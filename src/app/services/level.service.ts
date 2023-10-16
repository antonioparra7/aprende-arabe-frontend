import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Level } from '../entities/level';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private url:string = "http://localhost:8080/api/v1/levels";
  constructor(private http: HttpClient) { }
  getLevels() : Observable<Level[]>{
    return this.http.get<Level[]>(this.url);
  }
}