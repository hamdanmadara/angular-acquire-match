import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenMemory: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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
    return !!this.getToken();
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
}