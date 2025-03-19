import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.baseURL}/api`;

  constructor(private http: HttpClient) { }

  getRecruiterDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/recruiter`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 404) {
        errorMessage = 'Dashboard data not found.';
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = 'You are not authorized to access this data. Please log in again.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}