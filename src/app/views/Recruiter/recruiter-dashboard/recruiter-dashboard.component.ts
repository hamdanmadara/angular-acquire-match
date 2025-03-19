import { Component, OnInit } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardService } from '../../../shared/_services/Dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SummaryMetrics {
  active_jobs: number;
  total_applications: number;
  pending_applications: number;
  avg_match_score: string;
  shortlisted_candidates: number;
}

interface Application {
  id: number;
  match_score: string;
  created_at: string;
  status: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  job_id: number;
}

interface JobListing {
  id: number;
  title: string;
  status: string;
  created_at: string;
  application_count: number;
  avg_match_score: string;
}

interface ApplicationTrend {
  date: string;
  count: number;
}

interface DashboardData {
  summaryMetrics: SummaryMetrics;
  recentApplications: Application[];
  jobListings: JobListing[];
  topCandidates: Application[];
  applicationTrends: ApplicationTrend[];
}

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RecruiterDashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  loading = true;
  error = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading = true;
    this.error = false;
    
    this.dashboardService.getRecruiterDashboard()
      .pipe(
        catchError(error => {
          this.error = true;
          this.errorMessage = error.message || 'Failed to load dashboard data. Please try again later.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(response => {
        if (response && response.status === 'success') {
          this.dashboardData = response.data;
        }
      });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  retry(): void {
    this.fetchDashboardData();
  }

  parseFloat(value: string): number {
    return parseFloat(value);
  }

  roundNumber(number: string){
    return Math.round(Number(number))
  }
}