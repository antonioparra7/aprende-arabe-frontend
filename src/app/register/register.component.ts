import { Component, Input } from '@angular/core';
import { CountryService } from '../services/country.service';
import { Country } from '../entities/country';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isLogged: boolean;
  hide1 = true;
  hide2 = true;
  countries : Country[];

  form: FormGroup;

  constructor(private countryService:CountryService, private authenticationService:AuthenticationService,
              private appComponent: AppComponent, private _router:Router, private fb:FormBuilder, 
              private datePipe: DatePipe,private http:HttpClient){
    this.isLogged = appComponent.isLogged;
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      birthdate: ['', Validators.required],
      phone: ['', [Validators.required,Validators.minLength(9),Validators.maxLength(9)]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      isTeacher: [''],
      countryId: ['', Validators.required]
    });
  }

  ngOnInit(){
    this.countryService.getCountries().subscribe(
      countries => this.countries=countries
    );
  }

  public create():void{
    const request = {
      firstName: this.form.get('firstName')?.value,
      lastName:this.form.get('lastName')?.value,
      birthdate:this.datePipe.transform(this.form.get('birthdate')?.value, 'yyyy-MM-dd'),
      email:this.form.get('email')?.value,
      phone:this.form.get('phone')?.value,
      username:this.form.get('username')?.value,
      password:this.form.get('password')?.value,
      countryId:this.form.get('countryId')?.value,
      isTeacher:this.form.get('isTeacher')?.value
    };
    console.log(request);
    this.appComponent.isLogged = false;
    this.authenticationService.register(request).subscribe(() => this._router.navigateByUrl('/admin'));
    
  }
}