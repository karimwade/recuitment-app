import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { Announcement } from '../../models/application.model';

@Component({
  selector: 'app-announcements-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <h1>Active Recruitment Announcements</h1>
      
      <div *ngIf="announcements.length === 0" class="no-announcements">
        <p>No active announcements at the moment.</p>
      </div>
      
      <mat-card *ngFor="let announcement of announcements" class="announcement-card">
        <mat-card-header>
          <mat-card-title>{{announcement.title}}</mat-card-title>
          <mat-card-subtitle>Academic Year: {{announcement.academicYear.year}}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{announcement.description}}</p>
          <p><small>Posted: {{announcement.createdAt | date}}</small></p>
        </mat-card-content>
        <mat-card-actions *ngIf="authService.isAuthenticated() && authService.hasRole('CANDIDATE')">
          <button mat-raised-button color="primary" (click)="applyToAnnouncement(announcement.id)">
            Apply Now
          </button>
        </mat-card-actions>
        <mat-card-actions *ngIf="!authService.isAuthenticated()">
          <button mat-raised-button color="primary" (click)="router.navigate(['/auth/login'])">
            Login to Apply
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .announcement-card { margin-bottom: 20px; }
    .no-announcements { text-align: center; padding: 40px; }
  `]
})
export class AnnouncementsListComponent implements OnInit {
  announcements: Announcement[] = [];

  constructor(
    private applicationService: ApplicationService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.applicationService.getActiveAnnouncements().subscribe({
      next: (data) => this.announcements = data,
      error: (error) => console.error('Error loading announcements', error)
    });
  }

  applyToAnnouncement(announcementId: number) {
    this.router.navigate(['/candidate/apply', announcementId]);
  }
}