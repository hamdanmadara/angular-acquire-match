import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonDirective, ImgModule, FormModule } from '@coreui/angular';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../../../shared/_models/user.model';
import { AuthService } from '../../../shared/_services/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../general/loader.component';
@Component({
  selector: 'app-register',
  imports: [ButtonDirective, ImgModule, FormModule, RouterModule, CommonModule,
    ReactiveFormsModule,
    FormModule,LoaderComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  signupForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter methods for form controls (for easy access in the template)
  get nameControl() { return this.signupForm.get('name'); }
  get emailControl() { return this.signupForm.get('email'); }
  get passwordControl() { return this.signupForm.get('password'); }

  onSubmit(): void {
    // Reset any previous messages
    this.errorMessage = null;
    this.successMessage = null;
    
    // Stop if form is invalid
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    // Set submitting state to show loader
    this.isSubmitting = true;
    
    // Prepare payload with static role as 'recruiter'
    const payload: User = {
      ...this.signupForm.value,
      role: 'recruiter'
    };

    this.authService.signUp(payload).subscribe({
      next: (response: AuthResponse) => {
        if (response.status) {
          // Successful signup
          console.log('Signup successful:', response);
          this.successMessage = response.message || 'Account created successfully!';
          
          // Reset form after successful submission
          this.signupForm.reset();
          
          // Redirect after a short delay to show the success message
          setTimeout(() => {
            this.router.navigate(['/login'], { 
              queryParams: { registered: 'success' } 
            });
          }, 2000);
        } else {
          // API returned status false
          this.errorMessage = response.error_message || 'Registration failed. Please try again.';
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.errorMessage = error.error?.error_message || 'Registration failed. Please try again later.';
        this.isSubmitting = false;
      }
    });
  }

}

