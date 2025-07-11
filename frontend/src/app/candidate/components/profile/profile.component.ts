import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>My Profile</mat-card-title>
        </mat-card-header>
        <mat-card-content *ngIf="authService.currentUser$ | async as user">
          <div class="profile-info">
            <p><strong>Name:</strong> {{user.firstName}} {{user.lastName}}</p>
            <p><strong>Email:</strong> {{user.email}}</p>
            <p><strong>Role:</strong> {{user.role}}</p>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary">Edit Profile</button>
          <button mat-button>Change Password</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .profile-card { width: 100%; }
    .profile-info p { margin: 12px 0; }
  `]
})
export class ProfileComponent {
  constructor(public authService: AuthService) {}
}