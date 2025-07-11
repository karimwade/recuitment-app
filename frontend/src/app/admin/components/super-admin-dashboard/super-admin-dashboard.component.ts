import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
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
            </mat-form-field>
            
            <mat-form-field class="form-field">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" required>
            </mat-form-field>
            
            <mat-form-field class="form-field">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>
            
            <mat-form-field class="form-field">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="adminForm.invalid">
                Create Administrator
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.adminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  createAdmin() {
    if (this.adminForm.valid) {
      this.http.post('http://localhost:8080/api/super-admin/create-admin', this.adminForm.value).subscribe({
        next: () => {
          alert('Administrator created successfully!');
          this.adminForm.reset();
        },
        error: (error) => {
          console.error('Error creating admin', error);
          alert('Error creating administrator. Please try again.');
        }
      });
    }
  }
}