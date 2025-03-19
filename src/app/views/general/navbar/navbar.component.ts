// src/app/shared/components/navbar/navbar.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/_services/Auth/auth.service';
import { UserService } from '../../../shared/_services/User/user.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a [routerLink]="['/']" class="logo">JobPortal</a>
        </div>
        
        <div class="navbar-menu">
          <div class="navbar-end">
            <ng-container *ngIf="isLoggedIn; else loginButtons">
              <div class="user-dropdown">
                <div class="dropdown-trigger" (click)="toggleDropdown()">
                  <div class="user-info">
                    <div class="avatar">{{ userInitials }}</div>
                    <span class="user-name">{{ userName }}</span>
                    <span class="dropdown-arrow">▼</span>
                  </div>
                </div>
                
                <div class="dropdown-menu" [class.active]="isDropdownOpen">
                  <div class="dropdown-content">
                    <div class="dropdown-item">
                      <strong>{{ userName }}</strong>
                      <p>{{ userEmail }}</p>
                      <span class="role-badge">{{ userRole }}</span>
                    </div>
                    <hr class="dropdown-divider">
                    <a [routerLink]="['/recruiter/create-job']" class="dropdown-item" *ngIf="isRecruiter">
                      Create Job
                    </a>
                    <a [routerLink]="['/recruiter/dashboard']" class="dropdown-item">
                      Dashboard
                    </a>
                    <a [routerLink]="['/recruiter/job-listing']" class="dropdown-item">
                      My Job Postings
                    </a>
                    <hr class="dropdown-divider">
                    <a (click)="logout()" class="dropdown-item">
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </ng-container>
            
            <ng-template #loginButtons>
              <div class="auth-buttons">
                <a [routerLink]="['login']" class="btn-login">Login</a>
                <a [routerLink]="['/register']" class="btn-signup">Sign Up</a>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 0.75rem 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: #6b46c1;
      text-decoration: none;
    }
    
    .navbar-menu {
      display: flex;
      align-items: center;
    }
    
    .auth-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .btn-login, .btn-signup {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    
    .btn-login {
      color: #6b46c1;
    }
    
    .btn-signup {
      background-color: #6b46c1;
      color: white;
    }
    
    .user-dropdown {
      position: relative;
    }
    
    .dropdown-trigger {
      cursor: pointer;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #6b46c1;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    .user-name {
      font-weight: 500;
      color: #333;
    }
    
    .dropdown-arrow {
      font-size: 0.75rem;
      color: #666;
    }
    
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 220px;
      background-color: white;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
      display: none;
      z-index: 10;
      
      &.active {
        display: block;
      }
    }
    
    .dropdown-content {
      padding: 0.5rem 0;
    }
    
    .dropdown-item {
      display: block;
      padding: 0.625rem 1rem;
      color: #333;
      text-decoration: none;
      cursor: pointer;
      
      &:hover {
        background-color: #f9fafb;
      }
      
      strong {
        display: block;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      p {
        margin: 0;
        font-size: 0.875rem;
        color: #666;
      }
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 0.5rem 0;
      border: none;
    }
    
    .role-badge {
      display: inline-block;
      font-size: 0.75rem;
      padding: 0.125rem 0.375rem;
      background-color: #e9d5ff;
      color: #6b21a8;
      border-radius: 0.25rem;
      margin-top: 0.375rem;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isDropdownOpen = false;
  userName = '';
  userEmail = '';
  userRole = '';
  userInitials = '';
  isRecruiter = false;
  
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      
      if (user) {
        this.userName = user.name;
        this.userEmail = user.email;
        this.userRole = user.role;
        this.isRecruiter = user.role === 'recruiter';
        this.setUserInitials(user.name);
      } else {
        this.userName = '';
        this.userEmail = '';
        this.userRole = '';
        this.isRecruiter = false;
        this.userInitials = '';
      }
    });
  }
  
  setUserInitials(name: string): void {
    if (!name) {
      this.userInitials = '';
      return;
    }
    
    const nameParts = name.trim().split(' ');
    
    if (nameParts.length === 1) {
      this.userInitials = nameParts[0].charAt(0).toUpperCase();
    } else {
      this.userInitials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
    window.location.href = '/login';
  }
}