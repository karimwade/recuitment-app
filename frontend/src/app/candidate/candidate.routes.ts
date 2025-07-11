import { Routes } from '@angular/router';

export const candidateRoutes: Routes = [
  {
    path: 'applications',
    loadComponent: () => import('./components/applications-list/applications-list.component').then(m => m.ApplicationsListComponent)
  },
  {
    path: 'apply/:id',
    loadComponent: () => import('./components/apply/apply.component').then(m => m.ApplyComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  }
];