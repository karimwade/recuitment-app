import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/announcements', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'announcements',
    loadComponent: () => import('./shared/components/announcements-list/announcements-list.component').then(m => m.AnnouncementsListComponent)
  },
  {
    path: 'candidate',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CANDIDATE'] },
    loadChildren: () => import('./candidate/candidate.routes').then(m => m.candidateRoutes)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'super-admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadChildren: () => import('./admin/super-admin.routes').then(m => m.superAdminRoutes)
  },
  { path: '**', redirectTo: '/announcements' }
];