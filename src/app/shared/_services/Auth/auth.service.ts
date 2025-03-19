// src/app/auth/services/auth.service.ts

import { inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenMemory: string | null = null;
  private userInfoMemory: User | null = null;
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  
  // Observable to track user authentication state
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    // Initialize user from localStorage if available
    if (this.isBrowser) {
      const userData = this.getUserInfo();
      if (userData) {
        this.userSubject.next(userData);
      }
    }
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  signUp(payloadInfo: any): Observable<any> {
    console.log(payloadInfo);
    return this.http.post(`${environment?.baseURL}${environment?.register}`, payloadInfo).pipe(
      catchError(error => {
        console.error('signup Error:', error);
        
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error('Server-side error status:', error.status);
          console.error('Server-side error body:', error.error);
        }

        return throwError(() => error);
      })
    );
  }

  login(payloadInfo: any): Observable<any> {
    console.log(payloadInfo);
    return this.http.post(`${environment?.baseURL}${environment?.login}`, payloadInfo).pipe(
      catchError(error => {
        console.error('Login Error:', error);
        
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error('Server-side error status:', error.status);
          console.error('Server-side error body:', error.error);
        }

        return throwError(() => error);
      })
    );
  }

  // Store user info in local storage
  storeUserInfo(user: User): void {
    this.userInfoMemory = user;
    this.userSubject.next(user);
    
    if (this.isBrowser) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.warn('localStorage not available');
      }
    }
  }

  // Get user info from local storage
  getUserInfo(): User | null {
    if (this.isBrowser) {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          return JSON.parse(userData);
        }
        return null;
      } catch (e) {
        console.warn('localStorage not available');
        return this.userInfoMemory;
      }
    }
    return this.userInfoMemory;
  }

  // Get current user role
  getUserRole(): string | null {
    const user = this.getUserInfo();
    return user ? user.role : null;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  storeToken(token: string): void {
    this.tokenMemory = token;
    
    if (this.isBrowser) {
      try {
        localStorage.setItem('token', token);
      } catch (e) {
        console.warn('localStorage not available');
      }
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      try {
        return localStorage.getItem('token');
      } catch (e) {
        console.warn('localStorage not available');
        return this.tokenMemory;
      }
    }
    return this.tokenMemory;
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getUserInfo();
  }

  logout(): void {
    this.clearToken();
    this.clearUserInfo();
    this.userSubject.next(null);
  }

  clearToken(): void {
    this.tokenMemory = null;
    
    if (this.isBrowser) {
      try {
        localStorage.removeItem('token');
      } catch (e) {
        console.warn('localStorage not available');
      }
    }
  }

  clearUserInfo(): void {
    this.userInfoMemory = null;
    
    if (this.isBrowser) {
      try {
        localStorage.removeItem('user');
      } catch (e) {
        console.warn('localStorage not available');
      }
    }
  }
}