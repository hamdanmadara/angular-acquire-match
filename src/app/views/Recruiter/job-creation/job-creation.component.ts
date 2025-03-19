// src/app/jobs/job-creation/job-creation.component.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService, Question, JobFormData } from '../../../shared/_services/Job/job.service';
import { finalize } from 'rxjs/operators';
import { LoaderComponent } from '../../general/loader.component';
import { UserService } from '../../../shared/_services/User/user.service';

@Component({
  selector: 'app-job-creation',
  templateUrl: './job-creation.component.html',
  styleUrls: ['./job-creation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent
    ]
})
export class JobCreationComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  selectedFile?: File;
  
  currentStep = 1;
  totalSteps = 4;
  jobForm!: FormGroup;
  questions: Question[] = [];
  selectedQuestions: number[] = [];
  isSubmitting = false;
  isLoadingQuestions = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  fileSelected = false;
  fileName = '';
  
  // For job preview
  previewMode = false;
  
  // For multiple choice question types
  questionTypeText = 'text';
  questionTypeMultipleChoice = 'multiple_choice';
  questionTypeFileUpload = 'file_upload';
  userId: any
  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.userId =  this.userService.getUserId()
    console.log("iddd",this.userId)
    this.loadQuestions();
  }

  ngAfterViewInit() {
    console.log("ViewChild initialized:", this.fileInput);
  }

  initForm(): void {
    this.jobForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      company: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      status: ['active', [Validators.required]],
      // File is handled separately
    });
  }

  loadQuestions(): void {
    this.isLoadingQuestions = true;
    this.jobService.getQuestions()
      .pipe(finalize(() => this.isLoadingQuestions = false))
      .subscribe({
        next: (data) => {
          this.questions = data.map(q => ({
            ...q,
            selected: false
          }));
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          this.errorMessage = 'Failed to load application questions. Please refresh the page.';
        }
      });
  }

  // Form control getters for easier access in template
  get titleControl() { return this.jobForm.get('title'); }
  get companyControl() { return this.jobForm.get('company'); }
  get descriptionControl() { return this.jobForm.get('description'); }
  get statusControl() { return this.jobForm.get('status'); }

  // File handling
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log("File input element:", input);
    console.log("Files array:", input.files);
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log("Selected file:", file);
      this.fileName = file.name;
      this.fileSelected = true;
      // Store the file directly in a component property
      this.selectedFile = file;
    } else {
      console.log("No file selected or files array is empty");
      this.fileName = '';
      this.fileSelected = false;
      this.selectedFile = undefined;
    }
  }

  clearFile(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileName = '';
    this.fileSelected = false;
    this.selectedFile = undefined;
  }

  // Question selection
  toggleQuestion(question: Question): void {
    question.selected = !question.selected;
    
    if (question.selected) {
      if (!this.selectedQuestions.includes(question.id)) {
        this.selectedQuestions.push(question.id);
      }
    } else {
      this.selectedQuestions = this.selectedQuestions.filter(id => id !== question.id);
    }
  }

  // Navigation between steps
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // Validate current step before proceeding
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1: // Job Details
        return this.jobForm.valid;
      case 2: // PDF Upload
        return true; // File is optional
      case 3: // Questions
        return this.selectedQuestions.length > 0;
      default:
        return true;
    }
  }

  // Toggle preview mode
  togglePreview(): void {
    this.previewMode = !this.previewMode;
  }

  // Form submission
  // onSubmit(): void {
  //   if (!this.validateAllSteps()) {
  //     this.errorMessage = 'Please complete all required fields before submitting.';
  //     return;
  //   }

  //   this.isSubmitting = true;
  //   this.errorMessage = null;
  //   this.successMessage = null;


  //   // Prepare form data
  //   const jobData: JobFormData = {
  //     title: this.titleControl?.value,
  //     company: this.companyControl?.value,
  //     description: this.descriptionControl?.value,
  //     status: this.statusControl?.value,
  //     questions: this.selectedQuestions,
  //     recruiterId: this.userId
  //   };

  //   // Add file if selected
  //   console.log("this.fileSelected && this.fileInput?.nativeElement?.files?.[0]",this.fileSelected , this.fileInput?.nativeElement?.files?.[0])
  //   if (this.fileSelected && this.fileInput?.nativeElement?.files?.[0]) {
  //     console.log("file selected")
  //     jobData.jobDescriptionFile = this.fileInput.nativeElement.files[0];
  //   }

  //   this.jobService.createJob(jobData).subscribe({
  //     next: (response) => {
  //       this.isSubmitting = false;
  //       this.successMessage = 'Job created successfully!';
        
  //       // Reset form after successful submission
  //       setTimeout(() => {
  //         this.resetForm();
  //         this.router.navigate(['/jobs']);
  //       }, 2000);
  //     },
  //     error: (error) => {
  //       this.isSubmitting = false;
  //       console.error('Error creating job:', error);
  //       this.errorMessage = error.error?.message || 'Failed to create job. Please try again.';
  //     }
  //   });
  // }


  onSubmit(): void {
    if (!this.validateAllSteps()) {
      this.errorMessage = 'Please complete all required fields before submitting.';
      return;
    }
  
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;
  
    // Prepare form data
    const jobData: JobFormData = {
      title: this.titleControl?.value,
      company: this.companyControl?.value,
      description: this.descriptionControl?.value,
      status: this.statusControl?.value,
      questions: this.selectedQuestions,
      recruiterId: this.userId
    };
  
    // Check file input element directly
    console.log("File input element:", this.fileInput?.nativeElement);
    console.log("Files array:", this.fileInput?.nativeElement?.files);
    
    // Add file if selected - using a more direct approach
    // if (this.fileInput?.nativeElement?.files && this.fileInput.nativeElement.files.length > 0) {
    //   const file = this.fileInput.nativeElement.files[0];
    //   console.log("File to upload:", file);
    //   jobData.jobDescriptionFile = file;
    // } else {
    //   console.log("No file to upload");
    // }

    if (this.selectedFile) {
      console.log("Using stored file reference:", this.selectedFile);
      console.log("File name:", this.selectedFile.name);
      console.log("File size:", this.selectedFile.size);
      console.log("File type:", this.selectedFile.type);
      jobData.jobDescriptionFile = this.selectedFile;
    } else {
      console.log("No file to upload");
    }
  
    this.jobService.createJob(jobData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Job created successfully!';
        
        // Reset form after successful submission
        setTimeout(() => {
          this.resetForm();
          this.router.navigate(['/recruiter/job-listing']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating job:', error);
        this.errorMessage = error.error?.message || 'Failed to create job. Please try again.';
      }
    });
  }
  

  validateAllSteps(): boolean {
    return this.jobForm.valid && this.selectedQuestions.length > 0;
  }

  resetForm(): void {
    this.jobForm.reset({status: 'active'});
    this.selectedQuestions = [];
    this.questions.forEach(q => q.selected = false);
    this.clearFile();
    this.currentStep = 1;
    this.previewMode = false;
  }

  // For preview
  getSelectedQuestions(): Question[] {
    return this.questions.filter(q => this.selectedQuestions.includes(q.id));
  }

  // Helper function to determine if a question is required
  isQuestionRequired(question: Question): boolean {
    return question.is_required === 1;
  }
}