import { Routes } from '@angular/router';

export const superAdminRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/super-admin-dashboard/super-admin-dashboard.component').then(m => m.SuperAdminDashboardComponent)
  }
];