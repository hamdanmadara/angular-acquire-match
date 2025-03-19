// src/app/applications/application-success/application-success.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-application-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-container">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h1 class="success-title">Application Submitted!</h1>
      <p class="success-message">
        Thank you for applying. Your application has been successfully submitted. The recruiter will review your application and get back to you soon.
      </p>
      <!-- <div class="success-actions">
        <a [routerLink]="['/']" class="btn-home">Go to Home</a>
      </div> -->
    </div>
  `,
  styles: [`
    .success-container {
      max-width: 600px;
      margin: 4rem auto;
      padding: 2rem;
      text-align: center;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .success-icon {
      color: #10b981;
      margin-bottom: 1.5rem;
    }
    
    .success-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 1rem;
    }
    
    .success-message {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    
    .success-actions {
      .btn-home {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #6b46c1;
        color: white;
        font-weight: 500;
        border-radius: 0.375rem;
        text-decoration: none;
        transition: background-color 0.15s ease;
        
        &:hover {
          background-color: #5a32a3;
        }
      }
    }
  `]
})
export class ApplicationSuccessComponent {}