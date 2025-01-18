import { Routes } from '@angular/router';
import { LoginComponent } from './views/Auth/login/login.component';
import { RegisterComponent } from './views/Auth/register/register.component';
import { CreateOrganizationComponent } from './views/Auth/create-organization/create-organization.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./views/Auth/login/login.component')
          .then(mod => mod.LoginComponent)
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
    }
];
