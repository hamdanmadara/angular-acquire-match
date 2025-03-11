import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/Auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const token = this.authService.getToken() // Replace 'token' with your cookie name

    if (token) {
      return true; // Allow access to the page
    } else {
      // If token does not exist, navigate to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }

}
