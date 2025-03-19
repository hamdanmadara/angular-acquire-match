// src/app/services/application.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface CandidateMatch {
    id:number;
    match_score: string;
    created_at: string;
    updated_at: string;
    candidate_name: string;
    candidate_email: string;
    candidate_phone: string;
    processing_status: string;
  }
  
  export interface MatchesResponse {
    status: string;
    results: number;
    data: {
      matches: CandidateMatch[];
    };
  }

  export interface Candidate {
    id: number;
    name: string;
    email: string;
    phone: string;
  }
  
  export interface Job {
    id: number;
    title: string;
    company: string;
    description: string;
  }

  export interface SkillAssessment {
    gap: 'none' | 'minor' | 'moderate' | 'major';
    score: number;
    importance: number;
    skill_name: string;
  }

  export interface Analytics {
    text_analysis: string;
    skills_assessment: SkillAssessment[];
    strengths: string[];
    weaknesses: string[];
    education_fit: number;
    experience_fit: number;
    overall_score: number;
    source: string;
  }

  export interface CandidateAnalysis {
    id: number;
    status: string;
    match_score: string;
    answers: Record<string, string>;
    notes: string | null;
    created_at: string;
    updated_at: string;
    candidate: Candidate;
    job: Job;
    analytics: Analytics;
  }
  
  export interface AnalysisResponse {
    status: string;
    data: CandidateAnalysis;
  }


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private baseApiUrl = `${environment.baseURL}/api`;
  
  constructor(private http: HttpClient) {}

  // Get job details and questions
  getJobDetails(jobSlug: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/applications/job/${jobSlug}`).pipe(
      map((response: any) => response.data)
    );
  }

  // Submit job application
  submitApplication(jobSlug: string, applicationData: any, resume: File): Observable<any> {
    const formData = new FormData();
    
    // Append application data
    formData.append('name', applicationData.name);
    formData.append('email', applicationData.email);
    formData.append('phone', applicationData.phone);
    formData.append('answers', applicationData.answers);
    
    // Append resume file
    formData.append('resume', resume, resume.name);
    
    return this.http.post(`${this.baseApiUrl}/applications/job/${jobSlug}/apply`, formData);
  }


    getPdfViewUrl(pdfPath: string): string {
        // Extract just the filename from the full path
        const filename = pdfPath.split('\\').pop() || pdfPath.split('/').pop() || '';
        // Encode the filename to handle special characters
        const encodedFilename = encodeURIComponent(filename);
        return `${this.baseApiUrl}/view-pdf/${encodedFilename}`;
    }

    getTopMatches(jobId: number, limit: number = 100): Observable<CandidateMatch[]> {
        return this.http.get<MatchesResponse>(
          `${this.baseApiUrl}/applications/job/${jobId}/top-matches?limit=${limit}`
        ).pipe(
          map(response => response.data.matches)
        );
      }
    
      // Get detailed analysis for a specific candidate (placeholder for future implementation)
    //   getCandidateAnalysis(jobId: number, candidateEmail: string): Observable<any> {
    //     return this.http.get<any>(
    //       `${this.baseApiUrl}/applications/job/${jobId}/candidate/${candidateEmail}/analysis`
    //     );
    //   }

    getCandidateAnalysis(applicationId: number): Observable<CandidateAnalysis> {
        return this.http.get<AnalysisResponse>(
          `${this.baseApiUrl}/applications/${applicationId}?analysis=true`
        ).pipe(
          map(response => response.data)
        );
      }
    
      // Update application status
      updateApplicationStatus(applicationId: number, status: string): Observable<any> {
        return this.http.patch(
          `${this.baseApiUrl}/applications/${applicationId}`,
          { status }
        );
      }
    
      // Add notes to application
      addNotes(applicationId: number, notes: string): Observable<any> {
        return this.http.patch(
          `${this.baseApiUrl}/applications/${applicationId}`,
          { notes }
        );
      }
    
      // Get gap class for styling
      getGapClass(gap: 'none' | 'minor' | 'moderate' | 'major'): string {
        switch (gap) {
          case 'none':
            return 'gap-none';
          case 'minor':
            return 'gap-minor';
          case 'moderate':
            return 'gap-moderate';
          case 'major':
            return 'gap-major';
          default:
            return '';
        }
      }
    
      // Get score class for styling
      getScoreClass(score: number): string {
        if (score >= 80) {
          return 'score-high';
        } else if (score >= 60) {
          return 'score-medium';
        } else {
          return 'score-low';
        }
      }

      
}