import { Routes } from '@angular/router';

/**
 * Appointment Feature Routes
 *
 * Lazy-loaded routes for the appointment feature.
 */
export const appointmentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/calendar/calendar.page').then((m) => m.CalendarPage),
  },
];

