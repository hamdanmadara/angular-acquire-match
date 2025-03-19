// src/app/jobs/job-listings/job-listings.component.ts

import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import { JobService, Job } from '../../services/job.service';
import { finalize } from 'rxjs/operators';
import { LoaderComponent } from '../../general/loader.component';
import { JobService,Job } from '../../../shared/_services/Job/job.service';

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent]
})
export class JobListingsComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;
  copiedLinkId: number | null = null;
  activeActionMenuId: number | null = null;

  constructor(public jobService: JobService, private router: Router,) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.jobService.getRecruiterJobs()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (jobs) => {
          this.jobs = jobs;
        },
        error: (err) => {
          console.error('Error loading jobs:', err);
          this.error = 'Failed to load jobs. Please try again.';
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'draft':
        return 'status-draft';
      case 'closed':
        return 'status-closed';
      default:
        return 'status-default';
    }
  }

  copyJobLink(job: Job): void {
    const applicationUrl = this.jobService.getJobApplicationUrl(job.job_link);
    
    navigator.clipboard.writeText(applicationUrl)
      .then(() => {
        this.copiedLinkId = job.id;
        
        // Reset copied status after 3 seconds
        setTimeout(() => {
          if (this.copiedLinkId === job.id) {
            this.copiedLinkId = null;
          }
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  updateJobStatus(job: Job, newStatus: string): void {
    if (job.status === newStatus) return;
    
    this.jobService.updateJobStatus(job.id, newStatus)
      .subscribe({
        next: () => {
          job.status = newStatus;
          this.successMessage = `Job status updated to ${newStatus}`;
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          console.error('Error updating job status:', err);
          this.error = 'Failed to update job status. Please try again.';
        }
      });
  }

  deleteJob(jobId: number): void {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    
    this.jobService.deleteJob(jobId)
      .subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.id !== jobId);
          this.successMessage = 'Job deleted successfully';
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          console.error('Error deleting job:', err);
          this.error = 'Failed to delete job. Please try again.';
        }
      });
  }

  // Add this method to your JobListingsComponent class
  toggleActionMenu(jobId: number): void {
    if (this.activeActionMenuId === jobId) {
      this.activeActionMenuId = null;
    } else {
      this.activeActionMenuId = jobId;
    }
  }

  // Add a click handler to close menus when clicking elsewhere
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    // Check if the click was outside any dropdown
    const clickedElement = event.target as HTMLElement;
    const isDropdownButton = clickedElement.closest('.btn-actions');
    const isDropdownMenu = clickedElement.closest('.dropdown-menu');
    
    if (!isDropdownButton && !isDropdownMenu) {
      this.activeActionMenuId = null;
    }
  }

  goToSubmitJobs(job_id:Number): void {
    this.router.navigate(['/jobs', job_id, 'candidates']);
  }
}