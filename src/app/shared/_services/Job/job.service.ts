// src/app/services/job.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../User/user.service';
import { environment } from '../../../../environments/environment';

export interface QuestionOption {
  id: number;
  question_id: number;
  option_text: string;
  option_order: number;
  created_at: string;
}

export interface Question {
  id: number;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'file_upload';
  is_required: number;
  created_at: string;
  updated_at: string;
  options?: QuestionOption[];
  selected?: boolean;
}

export interface QuestionResponse {
  status: string;
  results: number;
  data: {
    questions: Question[];
  };
}

export interface Job {
  id: number;
  title: string;
  company: string;
  recruiter_id: number;
  description: string;
  jd_file_path: string | null;
  status: string;
  job_link: string;
  created_at: string;
  updated_at: string;
  jd_text: string | null;
  jd_embedding: any | null;
}

export interface JobsResponse {
  status: string;
  results: number;
  data: {
    jobs: Job[];
  };
}

export interface JobFormData {
  title: string;
  company: string;
  description: string;
  status: string;
  questions: number[];
  jobDescriptionFile?: File;
  recruiterId: Number;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
    private baseApiUrl = `${environment.baseURL}/api`;
    private jobsApiUrl = `${this.baseApiUrl}/jobs`;
  private questionsApiUrl = `${this.baseApiUrl}/questions`;
  
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  // Fetch all available questions from the API
  getQuestions(): Observable<Question[]> {
    return this.http.get<QuestionResponse>(this.questionsApiUrl).pipe(
      map(response => response.data.questions)
    );
  }

  // Create a new job
//   createJob(jobData: JobFormData): Observable<any> {
//     const formData = new FormData();
    
//     // Append text fields
//     formData.append('title', jobData.title);
//     formData.append('company', jobData.company);
//     formData.append('description', jobData.description);
//     formData.append('status', jobData.status);
    
//     // Append questions as JSON string
//     formData.append('questions', JSON.stringify(jobData.questions));
//     formData.append('recruiterId', JSON.stringify(jobData.recruiterId));

//     // Append file if exists
//     if (jobData.jobDescriptionFile) {
//       formData.append('jobDescription', jobData.jobDescriptionFile, jobData.jobDescriptionFile.name);
//     }
    
//     return this.http.post(this.jobsApiUrl, formData);
//   }

  createJob(jobData: JobFormData): Observable<any> {
    const formData = new FormData();
    
    // Append text fields
    formData.append('title', jobData.title);
    formData.append('company', jobData.company);
    formData.append('description', jobData.description);
    formData.append('status', jobData.status);
    formData.append('recruiterId', JSON.stringify(jobData.recruiterId));

    
    // Append questions as JSON string
    formData.append('questions', JSON.stringify(jobData.questions));
    
    // Append file if exists - with more debugging
    if (jobData.jobDescriptionFile) {
      console.log("Appending file to FormData:", jobData.jobDescriptionFile);
      console.log("File name:", jobData.jobDescriptionFile.name);
      console.log("File size:", jobData.jobDescriptionFile.size);
      console.log("File type:", jobData.jobDescriptionFile.type);
      
      // Use 'jobDescription' as the field name - make sure this matches what your backend expects
      formData.append('jobDescription', jobData.jobDescriptionFile, jobData.jobDescriptionFile.name);
      
      // Log formData content (note: this is limited, as FormData isn't easily inspectable)
      console.log("FormData created with file");
    } else {
      console.log("No file to append to FormData");
    }
    
    // Log the request being made
    console.log("Making POST request to:", this.jobsApiUrl);
    
    // Add proper headers for multipart/form-data
    return this.http.post(this.jobsApiUrl, formData);
  }

  // Get jobs posted by the current recruiter
  getRecruiterJobs(): Observable<Job[]> {
    const recruiterId = this.userService.getUserId();
    if (!recruiterId) {
      throw new Error('User ID not found');
    }
    
    return this.http.get<JobsResponse>(`${this.jobsApiUrl}/recruiter/${recruiterId}`).pipe(
      map(response => response.data.jobs)
    );
  }

  // Get job by ID
  getJobById(jobId: number): Observable<Job> {
    return this.http.get<any>(`${this.jobsApiUrl}/${jobId}`).pipe(
      map(response => response.data.job)
    );
  }

  // Update job status
  updateJobStatus(jobId: number, status: string): Observable<any> {
    return this.http.patch(`${this.jobsApiUrl}/${jobId}`, { status });
  }

  // Delete job
  deleteJob(jobId: number): Observable<any> {
    return this.http.delete(`${this.jobsApiUrl}/${jobId}`);
  }

  // Get question by ID from a provided list
  getQuestionById(questions: Question[], id: number): Question | undefined {
    return questions.find(q => q.id === id);
  }

  // Get application URL for a job
  getJobApplicationUrl(jobLink: string): string {
    // Replace with your actual application URL structure
    return `${window.location.origin}/apply/${jobLink}`;
  }
}