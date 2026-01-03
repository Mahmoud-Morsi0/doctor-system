import { Routes } from '@angular/router';

export const patientRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)

  },
  {
    path: ':patientId',
    loadComponent: () => import('./pages/patient-profile/patient-profile').then(m => m.PatientProfile)
  }

];

