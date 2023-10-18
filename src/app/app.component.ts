import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aprende-arabe-frontend';
  isLogged = false;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.isLogged$.subscribe((isLogged) => {
      this.isLogged = isLogged;
    });
  }
}
