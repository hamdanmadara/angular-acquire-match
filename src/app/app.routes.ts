import { Routes } from '@angular/router';
import { AuthGuard } from './shared/_guards/authGuard';
import { LoginGuard } from './shared/_guards/loginGuard';
// import '@coreui/coreui/dist/css/coreui.min.css'
// import "@coreui/coreui/scss/coreui";
// import "tailwindcss/tailwind.css";
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./views/Auth/login/login.component')
          .then(mod => mod.LoginComponent),
          canActivate:[LoginGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./views/Auth/register/register.component')
          .then(mod => mod.RegisterComponent)
    },
    {
        path: 'create-organization',
        loadComponent: () => import('./views/Auth/create-organization/create-organization.component')
          .then(mod => mod.CreateOrganizationComponent)
    },
    {
        path: 'user/profile',
        loadComponent: () => import('./views/Recruiter/Profile/profile.component')
          .then(mod => mod.ProfileComponent),
          canActivate:[AuthGuard]
    },
    {
        path: 'recruiter/create-job',
        loadComponent: () => import('./views/Recruiter/job-creation/job-creation.component')
          .then(mod => mod.JobCreationComponent),
          canActivate:[AuthGuard]
    },
    {
        path: 'recruiter/job-listing',
        loadComponent: () => import('./views/Recruiter/job-listings/job-listings.component')
          .then(mod => mod.JobListingsComponent),
          canActivate:[AuthGuard]
    },
    {
        path: 'apply/:jobSlug',
        // redirectTo: 'applications/job/:jobSlug'
        loadComponent: () => import('./views/Application/job-application/job-application.component')
          .then(mod => mod.JobApplicationComponent)
      },
      {
        path: 'jobs/:jobId/candidates',
        // redirectTo: 'applications/job/:jobSlug'
        loadComponent: () => import('./views/Recruiter/candidate-matches/candidate-matches.component')
          .then(mod => mod.CandidateMatchesComponent),
          canActivate:[AuthGuard]
      },
      {
        path: 'applications/:applicationId/analysis',
        // redirectTo: 'applications/job/:jobSlug'
        loadComponent: () => import('./views/Recruiter/candidate-analysis/candidate-analysis.component')
          .then(mod => mod.CandidateAnalysisComponent),
          canActivate:[AuthGuard]
      },
      {
        path: 'application/success',
        loadComponent: () => import('./views/general/application-success.component')
          .then(c => c.ApplicationSuccessComponent)
      },
      {
        path: 'recruiter/dashboard',
        loadComponent: () => import('./views/Recruiter/recruiter-dashboard/recruiter-dashboard.component')
          .then(c => c.RecruiterDashboardComponent)
      }
    
];
