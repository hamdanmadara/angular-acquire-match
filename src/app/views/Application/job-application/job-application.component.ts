// src/app/views/Application/job-application/job-application.component.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoaderComponent } from '../../general/loader.component';
import { ApplicationService } from '../../../shared/_services/Application/application.service';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';

interface JobDetails {
  id: number;
  title: string;
  company: string;
  description: string;
  recruiter_name: string;
  created_at: string;
  jd_file_path?: string;
}

interface QuestionOption {
  id: number;
  question_id: number;
  option_text: string;
  option_order: number;
  created_at: string;
}

interface Question {
  id: number;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'file_upload';
  is_required: number;
  created_at: string;
  updated_at: string;
  options?: QuestionOption[];
}

interface JobApplicationData {
  job: JobDetails;
  questions: Question[];
}

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    SafeUrlPipe
  ]
})
export class JobApplicationComponent implements OnInit {
  @ViewChild('resumeInput') resumeInput!: ElementRef<HTMLInputElement>;
  
  activeTab: 'details' | 'apply' = 'details';
  isLoading = true;
  isSubmitting = false;
  jobSlug = '';
  jobData!: JobApplicationData;
  applicationForm!: FormGroup;
  error: string | null = null;
  successMessage: string | null = null;
  resumeSelected = false;
  resumeFileName = '';
  selectedResume: File | null = null;
  
  // PDF related properties
  hasJobDescriptionFile = false;
  pdfViewUrl: string | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobSlug = params['jobSlug'];
      this.loadJobDetails();
    });
  }

  loadJobDetails(): void {
    this.isLoading = true;
    this.error = null;
    
    this.applicationService.getJobDetails(this.jobSlug)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data: JobApplicationData) => {
          this.jobData = data;
          this.initForm();
          
          // Check if job has a PDF file path
          this.hasJobDescriptionFile = !!this.jobData?.job?.jd_file_path;
          
          // Set up PDF viewer URL if there's a file path
          if (this.hasJobDescriptionFile && this.jobData.job.jd_file_path) {
            this.setupPdfViewer(this.jobData.job.jd_file_path);
          }
        },
        error: (err) => {
          console.error('Error loading job details:', err);
          this.error = 'Failed to load job details. Please try again.';
        }
      });
  }

  setupPdfViewer(pdfPath: string): void {
    // Extract just the filename from the full path
    const pathParts = pdfPath.split('\\');
    const filename = pathParts[pathParts.length - 1];
    
    // Create the URL for the PDF viewer endpoint
    this.pdfViewUrl = `http://localhost:3000/api/view-pdf/${encodeURIComponent(filename)}`;
  }

  initForm(): void {
    if (!this.jobData) {
      return;
    }
    
    const formGroup: any = {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]]
    };
    
    // Add questions to form
    this.jobData.questions.forEach(question => {
      // For multiple choice questions that are required, set validators
      if (question.is_required === 1) {
        formGroup[`question_${question.id}`] = ['', [Validators.required]];
      } else {
        formGroup[`question_${question.id}`] = [''];
      }
    });
    
    this.applicationForm = this.formBuilder.group(formGroup);
  }

  switchTab(tab: 'details' | 'apply'): void {
    this.activeTab = tab;
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.resumeFileName = file.name;
      this.resumeSelected = true;
      this.selectedResume = file;
    } else {
      this.resumeFileName = '';
      this.resumeSelected = false;
      this.selectedResume = null;
    }
  }

  clearResume(): void {
    if (this.resumeInput) {
      this.resumeInput.nativeElement.value = '';
    }
    this.resumeFileName = '';
    this.resumeSelected = false;
    this.selectedResume = null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.applicationForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (!this.jobData) {
      return;
    }

    // Mark all form controls as touched to show validation errors
    Object.keys(this.applicationForm.controls).forEach(key => {
      this.applicationForm.get(key)?.markAsTouched();
    });
    
    if (this.applicationForm.invalid) {
      return;
    }
    
    if (!this.selectedResume) {
      this.error = 'Please upload your resume to apply.';
      return;
    }
    
    this.isSubmitting = true;
    this.error = null;
    this.successMessage = null;
    
    // Prepare answers object
    const answers: Record<string, string> = {};
    this.jobData.questions.forEach(question => {
      const controlName = `question_${question.id}`;
      if (this.applicationForm.get(controlName)) {
        answers[question.id.toString()] = this.applicationForm.get(controlName)?.value;
      }
    });
    
    const applicationData = {
      name: this.applicationForm.get('name')?.value,
      email: this.applicationForm.get('email')?.value,
      phone: this.applicationForm.get('phone')?.value,
      answers: JSON.stringify(answers)
    };
    
    this.applicationService.submitApplication(this.jobSlug, applicationData, this.selectedResume)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (response) => {
          this.successMessage = 'Your application has been submitted successfully!';
          // Reset the form after successful submission
          this.applicationForm.reset();
          this.clearResume();
          
          // Redirect to success page after a delay
          setTimeout(() => {
            this.router.navigate(['/application/success']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error submitting application:', err);
          this.error = err.error?.message || 'Failed to submit application. Please try again.';
        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}