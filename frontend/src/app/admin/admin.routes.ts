import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'announcements',
    loadComponent: () => import('./components/announcements/announcements.component').then(m => m.AnnouncementsComponent)
  },
  {
    path: 'applications',
    loadComponent: () => import('./components/applications/applications.component').then(m => m.ApplicationsComponent)
  },
  {
    path: 'academic-years',
    loadComponent: () => import('./components/academic-years/academic-years.component').then(m => m.AcademicYearsComponent)
  }
];