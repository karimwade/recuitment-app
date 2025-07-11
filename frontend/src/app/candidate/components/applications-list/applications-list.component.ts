import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationService } from '../../../shared/services/application.service';
import { Application } from '../../../shared/models/application.model';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule, MatButtonModule],
  template: `
    <div class="container">
      <h1>My Applications</h1>
      
      <div *ngIf="applications.length === 0" class="no-applications">
        <p>You haven't submitted any applications yet.</p>
        <button mat-raised-button color="primary" routerLink="/announcements">
          View Available Announcements
        </button>
      </div>
      
      <mat-card *ngFor="let application of applications" class="application-card">
        <mat-card-header>
          <mat-card-title>{{application.announcement.title}}</mat-card-title>
          <mat-card-subtitle>{{application.announcement.academicYear.year}}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="application-info">
            <p><strong>Type:</strong> {{application.type}}</p>
            <p><strong>Status:</strong> 
              <mat-chip [color]="getStatusColor(application.status)" selected>
                {{application.status}}
              </mat-chip>
            </p>
            <p><strong>Submitted:</strong> {{application.createdAt | date}}</p>
            <p *ngIf="application.updatedAt !== application.createdAt">
              <strong>Last Updated:</strong> {{application.updatedAt | date}}
            </p>
            <p *ngIf="application.rejectionReason">
              <strong>Reason:</strong> {{application.rejectionReason}}
            </p>
          </div>
          
          <div class="documents">
            <h4>Documents:</h4>
            <ul>
              <li *ngIf="application.cvPath">CV: {{application.cvPath}}</li>
              <li *ngIf="application.degreePath">Degree: {{application.degreePath}}</li>
              <li *ngIf="application.coverLetterPath">Cover Letter: {{application.coverLetterPath}}</li>
            </ul>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .application-card { margin-bottom: 20px; }
    .no-applications { text-align: center; padding: 40px; }
    .application-info { margin-bottom: 16px; }
    .documents ul { margin: 8px 0; padding-left: 20px; }
  `]
})
export class ApplicationsListComponent implements OnInit {
  applications: Application[] = [];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.applicationService.getMyApplications().subscribe({
      next: (data) => this.applications = data,
      error: (error) => console.error('Error loading applications', error)
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'primary';
      case 'REJECTED': return 'warn';
      default: return 'accent';
    }
  }
}