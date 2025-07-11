import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
  template: `
    <mat-toolbar color="primary">
      <span>Recruitment System</span>
      <span class="spacer"></span>
      <div *ngIf="authService.currentUser$ | async as user; else loginButtons">
        <button mat-button [matMenuTriggerFor]="menu">
          {{user.firstName}} {{user.lastName}}
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="navigate('/candidate/profile')" *ngIf="user.role === 'CANDIDATE'">Profile</button>
          <button mat-menu-item (click)="navigate('/candidate/applications')" *ngIf="user.role === 'CANDIDATE'">My Applications</button>
          <button mat-menu-item (click)="navigate('/admin/dashboard')" *ngIf="user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'">Admin Dashboard</button>
          <button mat-menu-item (click)="navigate('/super-admin/dashboard')" *ngIf="user.role === 'SUPER_ADMIN'">Super Admin</button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">Logout</button>
        </mat-menu>
      </div>
      <ng-template #loginButtons>
        <button mat-button (click)="navigate('/auth/login')">Login</button>
        <button mat-button (click)="navigate('/auth/register')">Register</button>
      </ng-template>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    mat-toolbar { position: sticky; top: 0; z-index: 1000; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}