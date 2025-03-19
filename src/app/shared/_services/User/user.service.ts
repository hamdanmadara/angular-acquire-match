// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, User } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private authService: AuthService) {}

  /**
   * Get current user information as an observable
   * This is useful for components that need to react to user changes
   */
  getCurrentUser$(): Observable<User | null> {
    return this.authService.user$;
  }

  /**
   * Get current user information synchronously
   * This is useful for quick checks and guards
   */
  getCurrentUser(): User | null {
    return this.authService.getUserInfo();
  }

  /**
   * Get user's display name
   * Returns the user's name or a default string if not available
   */
  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    return user?.name || 'User';
  }

  /**
   * Get user's email
   * Returns the user's email or an empty string if not available
   */
  getUserEmail(): string {
    const user = this.getCurrentUser();
    return user?.email || '';
  }

  /**
   * Get user's ID
   * Returns the user's ID or null if not available
   */
  getUserId(): number | null {
    const user = this.getCurrentUser();
    console.log("userId", user)
    return user?.id || null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Get user's role
   * Returns the user's role or null if not available
   */
  getUserRole(): string | null {
    return this.authService.getUserRole();
  }

  /**
   * Check if user is a recruiter
   */
  isRecruiter(): boolean {
    return this.hasRole('recruiter');
  }

  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}