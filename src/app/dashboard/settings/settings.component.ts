import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs';
import { User } from 'src/app/entities/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { GmailService } from 'src/app/services/gmail.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  public user: User;
  private characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_:;?><,./-=';
  private password: string = '';
  constructor(private dashboardService: DashboardService, private userService: UserService, private gmailService: GmailService, private authenticationService: AuthenticationService, private _router: Router) { }
  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
  }

  deleteUser(id: number) {
    Swal.fire({
      title: "¿Seguro que desea eliminar su cuenta en AprendeArabe?",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).pipe(
          map((response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Cuenta eliminada con éxito',
              text: 'Su cuenta se ha eliminado con éxito. Esperamos que vuelvas próximamente.',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.removeItem('token');
                this.authenticationService.setIsLogged(false);
                this._router.navigate(['/home']);
              }
            });
          }),
          catchError((error) => {
            Swal.fire(`Error al eliminar la cuenta`, error.message, 'error');
            throw error;
          })
        ).subscribe();
      }
    });
  }

  updatePassword() {
    this.generatePassword();
    this.sendEmail();
  }

  sendEmail() {
    const request = {
      to: this.user.email,
      subject: "Restablecimiento de contraseña en AprendeArabe",
      body: `Su nueva contraseña para acceder a AprendeArabe es '${this.password}'`
    }
    this.gmailService.sendEmail(request).pipe(
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña nueva enviada al correo electrónico',
          text: 'Se ha enviado correctamente su nueva contraseña al correo electrónico indicado. Por favor, revise su bandeja de entrada.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('token');
            this.authenticationService.setIsLogged(false);
            this._router.navigate(['/login']);
          }
        });
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
