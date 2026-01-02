import { Routes } from '@angular/router';

/**
 * Application Routes
 *
 * Main routing configuration with lazy-loaded feature modules.
 * All routes are lazy-loaded for better performance.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/employee/pages/users.page').then(m => m.UsersPageComponent)
      },
      {
        path: 'reservations',
        loadChildren: () => import('./features/reservations/reservations.routes').then(m => m.reservationsRoutes)
      },
      {
        path: 'patients',
        loadChildren: () => import('./features/patient/patient.routes').then(m => m.patientRoutes)
      },
      {
        path: 'employees',
        loadChildren: () => import('./features/employee/employee.routes').then(m => m.employeeRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
