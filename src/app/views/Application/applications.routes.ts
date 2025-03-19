// src/app/applications/applications.routes.ts

import { Routes } from '@angular/router';
import { JobApplicationComponent } from './job-application/job-application.component';
import { AuthGuard } from '../../shared/_guards/authGuard';

export const APPLICATION_ROUTES: Routes = [
  {
    path: 'job/:jobSlug',
    component: JobApplicationComponent,
    canActivate:[AuthGuard]

  },
  {
    path: 'success',
    loadComponent: () => import('./application-success/application-success.component')
      .then(c => c.ApplicationSuccessComponent)
  }
];