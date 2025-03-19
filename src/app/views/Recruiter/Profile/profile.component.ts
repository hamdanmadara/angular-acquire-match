import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/_services/Auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private authService: AuthService, private router:Router){

  }

  logout(): void {
    this.authService.clearToken(); // Remove the token from storage
    this.router.navigate(['/login']); // Redirect to the login page
  }

}
