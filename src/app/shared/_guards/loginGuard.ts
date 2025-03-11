import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/Auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Use the AuthService method to check login status
    if (this.authService.isLoggedIn()) {
      // If logged in, redirect to home
      this.router.navigate(['/user/profile']);
      return false;
    } else {
      return true; // Allow access to the login page
    }
  }
}