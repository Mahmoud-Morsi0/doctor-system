import { Routes } from '@angular/router';

/**
 * Login Feature Routes
 *
 * Routes for authentication pages
 */
export const loginRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },
];

