import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule, MatIconModule, MatDialogModule],
  template: `
    <div class="container">
      <h1>Super Admin Dashboard</h1>
      
      <mat-card class="create-admin-card">
        <mat-card-header>
          <mat-card-title>Create New Administrator</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="adminForm" (ngSubmit)="createAdmin()">
            <mat-form-field class="form-field">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" required>
              <mat-error *ngIf="adminForm.get('firstName')?.hasError('required')">
                First name is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field class="form-field">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" required>
              <mat-error *ngIf="adminForm.get('lastName')?.hasError('required')">
                Last name is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field class="form-field">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="adminForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="adminForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>
            
            <mat-form-field class="form-field">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-error *ngIf="adminForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="adminForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="adminForm.invalid || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20" style="margin-right: 8px;"></mat-spinner>
                <mat-icon *ngIf="!isLoading">person_add</mat-icon>
                {{ isLoading ? 'Creating...' : 'Create Administrator' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="info-card">
        <mat-card-header>
          <mat-card-title>System Information</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>As a Super Administrator, you can:</p>
          <ul>
            <li>Create new administrator accounts</li>
            <li>Access all admin functions</li>
            <li>Manage user roles and permissions</li>
            <li>Monitor system activity</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .create-admin-card, .info-card { margin-bottom: 20px; }
    .form-field { width: 100%; margin-bottom: 16px; }
    .form-actions { text-align: center; margin-top: 16px; }
    .info-card ul { padding-left: 20px; }
    .info-card li { margin: 8px 0; }
  `]
})
export class SuperAdminDashboardComponent {
  adminForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.adminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  createAdmin() {
    if (this.adminForm.valid && !this.isLoading) {
      this.isLoading = true;
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      this.http.post('http://localhost:8080/api/super-admin/create-admin', this.adminForm.value, { headers }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          const adminName = `${response.firstName} ${response.lastName}`;
          this.notificationService.showSuccess(
            `Administrator "${adminName}" created successfully! They can now log in with their credentials.`
          );
          this.adminForm.reset();
          // Mark form as pristine to remove validation errors
          Object.keys(this.adminForm.controls).forEach(key => {
            this.adminForm.get(key)?.setErrors(null);
          });
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 400) {
            this.notificationService.showWarning('Email already exists. Please use a different email.');
          } else if (error.status === 403) {
            this.notificationService.showError('Access denied. Super admin privileges required.');
          } else if (error.status === 0) {
            this.notificationService.showError('Connection error. Please check your internet connection.');
          } else {
            this.notificationService.showError('Failed to create administrator. Please try again.');
          }
        }
      });
    }
  }
}