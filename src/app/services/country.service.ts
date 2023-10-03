import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../entities/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private url:string = 'http://localhost:8080/api/v1/countries';
  
  constructor(private http:HttpClient) { }

  getCountries() : Observable<Country[]>{
    return this.http.get<Country[]>(this.url);
  }
}
