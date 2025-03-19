// src/app/views/Recruiter/candidate-matches/candidate-matches.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '../../general/loader.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApplicationService, CandidateMatch } from '../../../shared/_services/Application/application.service';

@Component({
  selector: 'app-candidate-matches',
  templateUrl: './candidate-matches.component.html',
  styleUrls: ['./candidate-matches.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    ReactiveFormsModule
  ]
})
export class CandidateMatchesComponent implements OnInit {
  jobId: number = 0;
  candidateMatches: CandidateMatch[] = [];
  filteredMatches: CandidateMatch[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  searchControl = new FormControl('');
  sortField: string = 'match_score';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = +params['jobId']; // Convert to number
      this.loadCandidateMatches();
    });

    // Set up search functionality
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterMatches(value || '');
    });
  }

  loadCandidateMatches(): void {
    this.isLoading = true;
    this.error = null;
    
    this.applicationService.getTopMatches(this.jobId)
      .subscribe({
        next: (matches) => {
          this.candidateMatches = matches;
          this.filteredMatches = [...matches];
          this.sortMatches();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading candidate matches:', err);
          this.error = 'Failed to load candidate matches. Please try again.';
          this.isLoading = false;
        }
      });
  }

  filterMatches(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredMatches = [...this.candidateMatches];
    } else {
      const term = searchTerm.toLowerCase().trim();
      this.filteredMatches = this.candidateMatches.filter(match => 
        match.candidate_name.toLowerCase().includes(term) ||
        match.candidate_email.toLowerCase().includes(term)
      );
    }
    this.sortMatches();
  }

  sortMatches(field: string = this.sortField, direction: 'asc' | 'desc' = this.sortDirection): void {
    this.sortField = field;
    this.sortDirection = direction;
    
    this.filteredMatches.sort((a, b) => {
      let aValue: any = a[field as keyof CandidateMatch];
      let bValue: any = b[field as keyof CandidateMatch];
      
      // Handle numeric values
      if (field === 'match_score') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  toggleSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.sortMatches(this.sortField, this.sortDirection);
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return '↕';
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  getScoreClass(score: string): string {
    const numScore = parseFloat(score);
    if (numScore >= 80) {
      return 'score-high';
    } else if (numScore >= 60) {
      return 'score-medium';
    } else {
      return 'score-low';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }

  // viewAnalysis(candidateEmail: string): void {
  //   // Navigate to candidate analysis page
  //   this.router.navigate(['/recruiter/jobs', this.jobId, 'candidates', candidateEmail, 'analysis']);
  // }

  viewAnalysis(applicationId: number): void {
    // Navigate to application analysis page
    this.router.navigate(['/applications', applicationId, 'analysis']);
  }

  refreshData(): void {
    this.loadCandidateMatches();
  }
}