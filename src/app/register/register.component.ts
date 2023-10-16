import { Component, Input } from '@angular/core';
import { CountryService } from '../services/country.service';
import { Country } from '../entities/country';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControlOptions } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable, catchError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { CustomValidators } from '../utils/custom-validators';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isLogged: boolean;
  isValid:boolean;
  hide1 = true;
  hide2 = true;
  countries : Country[];

  form: FormGroup;

  constructor(private countryService:CountryService, private userService:UserService,
              private authenticationService:AuthenticationService,
              private appComponent: AppComponent, private _router:Router, private fb:FormBuilder, 
              private datePipe: DatePipe,private http:HttpClient){
    //this.isLogged = appComponent.isLogged;
    this.form = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        birthdate: ['', Validators.required],
        phone: ['', [Validators.required,Validators.minLength(9),Validators.pattern("^[0-9]*$")]],
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', Validators.required],
        passwordRepeat: ['', Validators.required],
        isTeacher: [false],
        countryId: ['', Validators.required]
      },
      {validators: [this.checkPasswords]} as AbstractControlOptions
    );
  }

  ngOnInit(){
    this.countryService.getCountries().subscribe(
      countries => this.countries=countries
    );
  }

  public create():void{
    this.isValid = true;
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
    this.checkUsernameExists(this.form.get('username')?.value);
    this.checkEmailExists(this.form.get('email')?.value);
    if(this.isValid){
      this.authenticationService.register(request).pipe(
        tap((token: string) => {
          Swal.fire('Usuario creado con éxito','Ya puedes iniciar sesión en AprendeArabe','success');
          this._router.navigate(['/login']);
        }),
        catchError((error)=>{
          Swal.fire('Error al registrar usuario', error, 'error');
          throw error;
        })
        ).subscribe();
    }
  }

  checkUsernameExists(username:string){
    this.userService.checkExistsUserByUsername(username).subscribe(
      userExists => {
        if(userExists){
          this.isValid = false;
          Swal.fire('Nombre de usuario existente',`El nombre de usuario '${username} ya existe en la aplicación.'`,'error');
        }
      });
  }

  checkEmailExists(email:string){
    this.userService.checkExistsUserByEmail(email).subscribe(
      userExists => {
        if(userExists){
          this.isValid = false;
          Swal.fire('Email existente',`El email '${email} ya existe en la aplicación.'`,'error');
        }
      });
  }

  checkPasswords(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const passwordRepeat = formGroup.get('passwordRepeat')?.value;
  
    if (password === passwordRepeat) {
      formGroup.get('passwordRepeat')?.setErrors(null); // Reiniciar los errores si coinciden
    } else {
      formGroup.get('passwordRepeat')?.setErrors({ notMatching: true }); // Establecer error si no coinciden
    }
  }

  // Errores
  firstNameError(){
    return this.form.get('firstName')?.hasError('required')?'Nombre no puede ser vacío' : '';
  }
  lastNameError(){
    return this.form.get('lastName')?.hasError('required')?'Apellidos no puede ser vacío' : '';
  }
  birthdateError(){
    return this.form.get('birthdate')?.hasError('required')?'Selecciona una fecha de nacimiento' : '';
  }
  countryError(){
    return this.form.get('countryId')?.hasError('required')?'Selecciona un país' : '';
  }
  emailError(){
    return this.form.get('email')?.hasError('required')?'Email no puede ser vacío' :
          this.form.get('email')?.hasError('email')?'El formato de email no es correcto':'';
  }
  phoneError(){
    return this.form.get('phone')?.hasError('required')?'Teléfono no puede ser vacío' :
          this.form.get('phone')?.hasError('minlength')?'Debe tener mínimo 9 números' :
          this.form.get('phone')?.hasError('pattern')?'Teléfono debe tener solamente números':'';
  }
  usernameError(){
    return this.form.get('username')?.hasError('required')?'Nombre de usuario no puede ser vacío' : 
          this.form.get('username')?.hasError('minlength')?'Debe tener mínimo 4 carácteres':'';
  }
  passwordError(){
    return this.form.get('password')?.hasError('required')?'Contraseña no puede ser vacío' : '';
  }
  passwordRepeatError(){
    return this.form.get('passwordRepeat')?.hasError('required')?'Contraseña no puede ser vacío' : 
          this.form.get('passwordRepeat')?.hasError('notMatching')?'Las contraseñas deben coincidir' : '';
  }
}