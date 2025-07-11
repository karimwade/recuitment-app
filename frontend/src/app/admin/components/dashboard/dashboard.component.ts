import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="container">
      <h1>Admin Dashboard</h1>
      
      <div class="dashboard-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Manage Announcements</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Create and manage recruitment announcements</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/announcements">
              Manage Announcements
            </button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Review Applications</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Review and process candidate applications</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/applications">
              Review Applications
            </button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Academic Years</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage academic years for announcements</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/academic-years">
              Manage Years
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
    .dashboard-card { height: 200px; display: flex; flex-direction: column; justify-content: space-between; }
  `]
})
export class DashboardComponent {}