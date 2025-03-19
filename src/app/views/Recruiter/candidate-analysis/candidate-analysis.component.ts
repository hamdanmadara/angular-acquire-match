// src/app/views/Recruiter/candidate-analysis/candidate-analysis.component.ts

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { CandidateAnalysisService, CandidateAnalysis, SkillAssessment } from '../../../shared/_services/candidates/candidate-analysis.service';
import { LoaderComponent } from '../../general/loader.component';
import { finalize } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { ApplicationService, CandidateAnalysis } from '../../../shared/_services/Application/application.service';

@Component({
  selector: 'app-candidate-analysis',
  templateUrl: './candidate-analysis.component.html',
  styleUrls: ['./candidate-analysis.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoaderComponent
  ]
})
export class CandidateAnalysisComponent implements OnInit, AfterViewInit {
  @ViewChild('skillsChart') skillsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fitChart') fitChartRef!: ElementRef<HTMLCanvasElement>;
  
  applicationId: number = 0;
  analysis: CandidateAnalysis | null = null;
  isLoading: boolean = true;
  isSaving: boolean = false;
  error: string | null = null;
  saveSuccess: string | null = null;
  notes: string = '';
  

  Object = Object;
  // For status change
  availableStatuses: string[] = ['pending', 'reviewing', 'interviewed', 'offered', 'hired', 'rejected'];
  selectedStatus: string = '';
  
  // Charts
  skillsChart: Chart | null = null;
  fitChart: Chart | null = null;
  
  // For paragraph display
  analysisTextParagraphs: string[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public candidateAnalysisService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.applicationId = +params['applicationId']; // Convert to number
      this.loadCandidateAnalysis();
    });
  }
  
  ngAfterViewInit(): void {
    // Charts will be initialized after data is loaded
  }

  initCharts(): void {
    // Use requestAnimationFrame to ensure the DOM is ready
    requestAnimationFrame(() => {
      try {
        if (this.analysis) {
          this.initSkillsChart();
          this.initFitChart();
        }
      } catch (e) {
        console.error('Error initializing charts:', e);
        // Retry after a delay
        setTimeout(() => this.initCharts(), 500);
      }
    });
  }
  
  // Then, update your loadCandidateAnalysis method to use this new approach:
  


  loadCandidateAnalysis(): void {
    this.isLoading = true;
    this.error = null;
    
    this.candidateAnalysisService.getCandidateAnalysis(this.applicationId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.analysis = data;
          this.selectedStatus = data.status;
          this.notes = data.notes || '';
          
          // Split analysis text into paragraphs
          this.analysisTextParagraphs = data.analytics.text_analysis.split('\n\n');
          
          // Use the improved chart initialization approach
          setTimeout(() => this.initCharts(), 100);
        },
        error: (err) => {
          console.error('Error loading candidate analysis:', err);
          this.error = 'Failed to load candidate analysis. Please try again.';
        }
      });
  }


  initSkillsChart(): void {
    if (!this.analysis || !this.skillsChartRef) return;
    
    const ctx = this.skillsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    
    // Sort skills by importance
    const sortedSkills = [...this.analysis.analytics.skills_assessment]
      .sort((a, b) => b.importance - a.importance);
    
    // Prepare data
    const labels = sortedSkills.map(skill => skill.skill_name);
    const scores = sortedSkills.map(skill => skill.score);
    const importances = sortedSkills.map(skill => skill.importance);
    
    // Determine colors based on gap
    const backgroundColors = sortedSkills.map(skill => this.getSkillBackgroundColor(skill.gap));
    const borderColors = sortedSkills.map(skill => this.getSkillBorderColor(skill.gap));
    
    if (this.skillsChart) {
      this.skillsChart.destroy();
    }
    
    this.skillsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Candidate Skill Level',
            data: scores,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          },
          {
            label: 'Required Skill Level',
            data: importances,
            type: 'line',
            fill: false,
            borderColor: '#6b46c1',
            borderDash: [5, 5],
            pointBorderColor: '#6b46c1',
            pointBackgroundColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Skill Level'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Skills'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Candidate Skills vs. Job Requirements'
          },
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const index = context.dataIndex;
                const gap = sortedSkills[index].gap;
                return `Gap: ${gap.charAt(0).toUpperCase() + gap.slice(1)}`;
              }
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  initFitChart(): void {
    if (!this.analysis || !this.fitChartRef) return;
    
    const ctx = this.fitChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    
    const { education_fit, experience_fit, overall_score } = this.analysis.analytics;
    
    if (this.fitChart) {
      this.fitChart.destroy();
    }
    
    this.fitChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Education Fit', 'Experience Fit', 'Overall Score'],
        datasets: [{
          label: 'Candidate Fit',
          data: [education_fit, experience_fit, overall_score],
          backgroundColor: 'rgba(107, 70, 193, 0.2)',
          borderColor: 'rgba(107, 70, 193, 1)',
          pointBackgroundColor: 'rgba(107, 70, 193, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(107, 70, 193, 1)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Overall Candidate Fit'
          },
          legend: {
            display: false
          }
        }
      }
    });
  }

  getSkillBackgroundColor(gap: 'none' | 'minor' | 'moderate' | 'major'): string {
    switch (gap) {
      case 'none':
        return 'rgba(16, 185, 129, 0.2)'; // Green with opacity
      case 'minor':
        return 'rgba(59, 130, 246, 0.2)'; // Blue with opacity
      case 'moderate':
        return 'rgba(245, 158, 11, 0.2)'; // Amber with opacity
      case 'major':
        return 'rgba(239, 68, 68, 0.2)'; // Red with opacity
      default:
        return 'rgba(107, 114, 128, 0.2)'; // Gray with opacity
    }
  }

  getSkillBorderColor(gap: 'none' | 'minor' | 'moderate' | 'major'): string {
    switch (gap) {
      case 'none':
        return 'rgb(16, 185, 129)'; // Green
      case 'minor':
        return 'rgb(59, 130, 246)'; // Blue
      case 'moderate':
        return 'rgb(245, 158, 11)'; // Amber
      case 'major':
        return 'rgb(239, 68, 68)'; // Red
      default:
        return 'rgb(107, 114, 128)'; // Gray
    }
  }

  updateStatus(): void {
    if (!this.analysis || this.selectedStatus === this.analysis.status) return;
    
    this.isSaving = true;
    this.saveSuccess = null;
    this.error = null;
    
    this.candidateAnalysisService.updateApplicationStatus(this.applicationId, this.selectedStatus)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: () => {
          if (this.analysis) {
            this.analysis.status = this.selectedStatus;
            this.saveSuccess = 'Status updated successfully';
            setTimeout(() => this.saveSuccess = null, 3000);
          }
        },
        error: (err) => {
          console.error('Error updating status:', err);
          this.error = 'Failed to update status. Please try again.';
        }
      });
  }

  saveNotes(): void {
    if (!this.analysis) return;
    
    this.isSaving = true;
    this.saveSuccess = null;
    this.error = null;
    
    this.candidateAnalysisService.addNotes(this.applicationId, this.notes)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: () => {
          if (this.analysis) {
            this.analysis.notes = this.notes;
            this.saveSuccess = 'Notes saved successfully';
            setTimeout(() => this.saveSuccess = null, 3000);
          }
        },
        error: (err) => {
          console.error('Error saving notes:', err);
          this.error = 'Failed to save notes. Please try again.';
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewing':
        return 'status-reviewing';
      case 'interviewed':
        return 'status-interviewed';
      case 'offered':
        return 'status-offered';
      case 'hired':
        return 'status-hired';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/jobs', this.analysis?.job.id, 'candidates']);
  }
}