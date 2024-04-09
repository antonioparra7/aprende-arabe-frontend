import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControlOptions } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable, catchError, map, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLogged: boolean;
  isValid: boolean;
  hide = true;
  form: FormGroup;

  constructor(private userService: UserService, private authenticationService: AuthenticationService,
    private appComponent: AppComponent, private _router: Router, private fb: FormBuilder,
    private http: HttpClient) {
    this.isLogged = this.appComponent.isLogged;
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      }
    );
  }

  public login(): void {
    const request = {
      username: this.form.get('username')?.value,
      password: this.form.get('password')?.value
    };
    this.userService.checkExistsUserByUsername(this.form.get('username')?.value).subscribe(
      userExists => {
        if(userExists){
          this.authenticationService.authenticate(request).pipe(
            tap((token: string) => {
              this.authenticationService.setIsLogged(true);
              localStorage.setItem('token',token);
              this._router.navigate(['/dashboard']);
            }),
            catchError((error: HttpErrorResponse) => {
              Swal.fire(`Error ${error.status}`, error.error, 'error');
              throw error;
            })
          ).subscribe();
        }
        else {
          Swal.fire('Usuario no existente', `El usuario con nombre de usuario '${request.username}' no existe en la aplicación.`, 'error');
        }
    });
  }

  checkUsernameExists(username:string){
    this.userService.checkExistsUserByUsername(username).subscribe(
      userExists => {
        console.log(userExists);
        if(userExists){
          return true;
        }
        return false;
      });
  }

  usernameError() {
    return this.form.get('username')?.hasError('required') ? 'Introduce tu nombre de usuario' : '';
  }
  passwordError() {
    return this.form.get('password')?.hasError('required') ? 'Introduce tu contraseña' : '';
  }
}
