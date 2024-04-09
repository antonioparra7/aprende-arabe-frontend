import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { GmailService } from '../services/gmail.service';
import { catchError, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent {
  private characters:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_:;?><,./-=';
  private password:string = '';
  public email:string = '';
  constructor(private userService:UserService, private gmailService:GmailService, private _router: Router){}

  restorePassword() {
    if (this.email.trim() !== '') {
      this.userService.checkExistsUserByEmail(this.email).subscribe(
        userExists => {
          if(userExists){
            this.generatePassword();
            this.sendEmail();
            Swal.fire({
              icon: 'success',
              title: 'Contraseña nueva enviada al correo electrónico',
              text: 'Se ha enviado correctamente su nueva contraseña al correo electrónico indicado. Por favor, revise su bandeja de entrada.',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this._router.navigate(['/login']);
              }
            });
          }
          else {
            Swal.fire("Usuario no registrado", 
            `El usuario con email: "${this.email}" no se encuentra registrado en AprendeArabe`
            , 'error');
          }
        }
      );
    }
    else {
      Swal.fire("Correo electrónico vacío", 
            `No se ha introducido ningún correo electrónico para restablecer la contraseña.`
            , 'error');
    } 
  }

  checkEmailExists(){
    this.userService.checkExistsUserByEmail(this.email).subscribe(
      userExists => {
        if(userExists){
          return true;
        }
        return false;
      });
  }

  sendEmail(){
    const request = {
      to: this.email,
      subject:"Restablecimiento de contraseña en AprendeArabe",
      body:`Su nueva contraseña para acceder a AprendeArabe es '${this.password}'`
    }
    this.gmailService.sendEmail(request).pipe(
      tap(response => {
        this._router.navigate(['/login']);
      }),
      catchError((error: HttpErrorResponse) => {
        Swal.fire(`Error ${error.status}`, error.error, 'error');
        throw error;
      })
    ).subscribe()
  }

  generatePassword() {
    let generatedPassword = '';
    for (let i = 0; i < 14; i++) {
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      generatedPassword += this.characters[randomIndex];
    }
    this.password = generatedPassword;
  }
}
