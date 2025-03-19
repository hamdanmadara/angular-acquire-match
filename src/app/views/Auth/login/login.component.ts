// src/app/auth/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/_services/Auth/auth.service';

// Import CoreUI components
import { ButtonModule, FormModule, CardModule, AlertModule, ImgModule, ButtonDirective } from '@coreui/angular';
import { LoaderComponent } from '../../general/loader.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoaderComponent,
    // CoreUI imports
    ButtonModule,
    FormModule,
    CardModule,
    AlertModule,
    ImgModule,
    ButtonDirective
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Check if user was redirected from signup
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'success') {
        this.successMessage = 'Account created successfully! Please login.';
      }
    });
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Getter methods for form controls (for easy access in the template)
  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  onSubmit(): void {
    // Reset any previous messages
    this.errorMessage = null;
    this.successMessage = null;
    
    // Stop if form is invalid
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Set submitting state to show loader
    this.isSubmitting = true;
    
    const payload = this.loginForm.value;

    this.authService.login(payload).subscribe({
      next: (response) => {
        if (response.status) {
          // Successful login
          console.log('Login successful:', response);
          
          // Store the token
          if (response.token) {
            this.authService.storeToken(response.token);
          }

          // Store user info in localStorage
          if (response.user) {
            this.authService.storeUserInfo(response.user);
          }
          
          // Show success message briefly before redirecting
          this.successMessage = 'Login successful! Redirecting...';
          
          // Redirect to appropriate page based on user role
          setTimeout(() => {
            // const userRole = this.authService.getUserRole();
            
            // if (userRole === 'recruiter') {
            //   this.router.navigate(['/jobs/create']);
            // } else if (userRole === 'admin') {
            //   this.router.navigate(['/dashboard']);
            // } else {
            //   this.router.navigate(['/dashboard']);
            // }
            // You can redirect to different routes based on user role if needed
            this.router.navigate(['/recruiter/dashboard']);
          }, 1000);
        } else {
          // API returned status false
          this.errorMessage = response.error_message || 'Login failed. Please check your credentials.';
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = error.error?.error_message || 'Login failed. Please try again later.';
        }
        
        this.isSubmitting = false;
      }
    });
  }
}