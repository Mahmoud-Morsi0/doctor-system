import { Routes } from '@angular/router';

/**
 * Patient Feature Routes
 *
 * Lazy-loaded routes for the patient feature.
 */
export const patientRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)

  },
  {
    path: ':patientId',
    loadComponent: () => import('./components/patient-profile/patient-profile').then(m => m.PatientProfile)
  }

];

