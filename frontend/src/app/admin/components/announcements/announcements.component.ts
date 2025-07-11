import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApplicationService } from '../../../shared/services/application.service';
import { Announcement, AcademicYear } from '../../../shared/models/application.model';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatSlideToggleModule],
  template: `
    <div class="container">
      <h1>Manage Announcements</h1>
      
      <mat-card class="create-card">
        <mat-card-header>
          <mat-card-title>Create New Announcement</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="announcementForm" (ngSubmit)="createAnnouncement()">
            <mat-form-field class="form-field">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required>
            </mat-form-field>
            
            <mat-form-field class="form-field">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4"></textarea>
            </mat-form-field>
            
            <mat-form-field class="form-field">
              <mat-label>Academic Year</mat-label>
              <mat-select formControlName="academicYearId" required>
                <mat-option *ngFor="let year of activeAcademicYears" [value]="year.id">
                  {{year.year}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="announcementForm.invalid">
                Create Announcement
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="list-card">
        <mat-card-header>
          <mat-card-title>Existing Announcements</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let announcement of announcements" class="announcement-item">
            <div class="announcement-header">
              <h3>{{announcement.title}}</h3>
              <mat-slide-toggle 
                [checked]="announcement.active"
                (change)="toggleAnnouncement(announcement.id)">
                {{announcement.active ? 'Active' : 'Inactive'}}
              </mat-slide-toggle>
            </div>
            
            <div class="announcement-details">
              <p><strong>Academic Year:</strong> {{announcement.academicYear.year}}</p>
              <p><strong>Description:</strong> {{announcement.description}}</p>
              <p><strong>Created:</strong> {{announcement.createdAt | date}}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .create-card, .list-card { margin-bottom: 20px; }
    .form-field { width: 100%; margin-bottom: 16px; }
    .form-actions { text-align: center; margin-top: 16px; }
    .announcement-item { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .announcement-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .announcement-details p { margin: 4px 0; }
  `]
})
export class AnnouncementsComponent implements OnInit {
  announcementForm: FormGroup;
  announcements: Announcement[] = [];
  activeAcademicYears: AcademicYear[] = [];

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService
  ) {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      academicYearId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAnnouncements();
    this.loadActiveAcademicYears();
  }

  loadAnnouncements() {
    this.applicationService.getAllAnnouncements().subscribe({
      next: (data) => this.announcements = data,
      error: (error) => console.error('Error loading announcements', error)
    });
  }

  loadActiveAcademicYears() {
    this.applicationService.getActiveAcademicYears().subscribe({
      next: (data) => this.activeAcademicYears = data,
      error: (error) => console.error('Error loading academic years', error)
    });
  }

  createAnnouncement() {
    if (this.announcementForm.valid) {
      this.applicationService.createAnnouncement(this.announcementForm.value).subscribe({
        next: () => {
          alert('Announcement created successfully!');
          this.announcementForm.reset();
          this.loadAnnouncements();
        },
        error: (error) => console.error('Error creating announcement', error)
      });
    }
  }

  toggleAnnouncement(id: number) {
    this.applicationService.toggleAnnouncement(id).subscribe({
      next: () => {
        this.loadAnnouncements();
      },
      error: (error) => console.error('Error toggling announcement', error)
    });
  }
}