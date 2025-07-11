import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { ApplicationService } from '../../../shared/services/application.service';
import { Application } from '../../../shared/models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatTableModule, MatPaginatorModule, MatChipsModule],
  template: `
    <div class="container">
      <h1>Manage Applications</h1>
      
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title>Search Applications</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="search()">
            <div class="search-fields">
              <mat-form-field>
                <mat-label>Candidate Name</mat-label>
                <input matInput formControlName="name">
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Email</mat-label>
                <input matInput formControlName="email">
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Academic Year</mat-label>
                <input matInput formControlName="year">
              </mat-form-field>
            </div>
            
            <div class="search-actions">
              <button mat-raised-button color="primary" type="submit">Search</button>
              <button mat-button type="button" (click)="clearSearch()">Clear</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="results-card">
        <mat-card-header>
          <mat-card-title>Applications ({{totalElements}} total)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let application of applications" class="application-item">
            <div class="application-header">
              <h3>{{application.user.firstName}} {{application.user.lastName}}</h3>
              <mat-chip [color]="getStatusColor(application.status)" selected>
                {{application.status}}
              </mat-chip>
            </div>
            
            <div class="application-details">
              <p><strong>Email:</strong> {{application.user.email}}</p>
              <p><strong>Announcement:</strong> {{application.announcement.title}}</p>
              <p><strong>Academic Year:</strong> {{application.announcement.academicYear.year}}</p>
              <p><strong>Type:</strong> {{application.type}}</p>
              <p><strong>Submitted:</strong> {{application.createdAt | date}}</p>
            </div>
            
            <div class="application-actions" *ngIf="application.status === 'IN_PROGRESS'">
              <button mat-raised-button color="primary" (click)="updateStatus(application.id, 'ACCEPTED')">
                Accept
              </button>
              <button mat-raised-button color="warn" (click)="rejectApplication(application)">
                Reject
              </button>
            </div>
          </div>
          
          <mat-paginator 
            [length]="totalElements"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25]"
            (page)="onPageChange($event)">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .search-card, .results-card { margin-bottom: 20px; }
    .search-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .search-actions { margin-top: 16px; }
    .application-item { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .application-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .application-details p { margin: 4px 0; }
    .application-actions { margin-top: 12px; }
    .application-actions button { margin-right: 8px; }
  `]
})
export class ApplicationsComponent implements OnInit {
  searchForm: FormGroup;
  applications: Application[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      email: [''],
      year: ['']
    });
  }

  ngOnInit() {
    this.search();
  }

  search() {
    const filters = {
      ...this.searchForm.value,
      page: this.currentPage,
      size: this.pageSize
    };

    this.applicationService.searchApplications(filters).subscribe({
      next: (response) => {
        this.applications = response.content;
        this.totalElements = response.totalElements;
      },
      error: (error) => console.error('Error searching applications', error)
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.currentPage = 0;
    this.search();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
  }

  updateStatus(applicationId: number, status: string) {
    this.applicationService.updateApplicationStatus(applicationId, status).subscribe({
      next: () => {
        alert('Application status updated successfully!');
        this.search();
      },
      error: (error) => console.error('Error updating status', error)
    });
  }

  rejectApplication(application: Application) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.applicationService.updateApplicationStatus(application.id, 'REJECTED', reason).subscribe({
        next: () => {
          alert('Application rejected successfully!');
          this.search();
        },
        error: (error) => console.error('Error rejecting application', error)
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'primary';
      case 'REJECTED': return 'warn';
      default: return 'accent';
    }
  }
}