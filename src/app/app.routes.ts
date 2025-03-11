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
    }
];
