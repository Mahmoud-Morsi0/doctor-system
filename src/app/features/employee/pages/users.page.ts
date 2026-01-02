/**
 * Pages Layer - Users Page
 *
 * Pages orchestrate components, services, and store.
 * Responsibilities:
 * ✓ Smart components (containers)
 * ✓ Connect to services
 * ✓ Connect to store
 * ✓ Handle routing
 * ✓ Handle user interactions
 * ✓ Pass data to components
 * ✓ Receive events from components
 *
 * Rules:
 * ✗ No business logic
 * ✗ No API calls
 *
 * Pages = orchestrators of the feature
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../components/user-card.component';
import { User } from '../data-access/services/create-user.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  template: `
    <div class="users-page">
      <h1>{{ 'employees.management' | transloco }}</h1>

      <div class="users-list">
          <!-- <app-user-card
            [user]="user"
            (userClick)="onUserClick($event)"
            (userDelete)="onUserDelete($event)"
          /> -->
      </div>


      <div class="empty-user-list">
        <p>{{ 'employees.empty' | transloco }}</p>
      </div>
    </div>
  `,
  styles: [`
    .users-page {
      padding: var(--spacing-xl);
      width: 100%;
      min-height: 100%;
    }

    .users-page h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--spacing-xl);
    }

    .users-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }

    .add-user-form {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
      flex-wrap: wrap;
    }

    .add-user-form input {
      flex: 1;
      min-width: 200px;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 0.9375rem;
      transition: border-color var(--transition-base);
    }

    .add-user-form input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .add-user-form button {
      padding: var(--spacing-sm) var(--spacing-lg);
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border: none;
      border-radius: var(--radius-sm);
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-base);
    }

    .add-user-form button:hover {
      background-color: var(--color-primary-dark);
    }

    .error {
      color: var(--color-danger);
      padding: var(--spacing-md);
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: var(--radius-sm);
      margin-top: var(--spacing-md);
    }
  `]
})
export class UsersPageComponent implements OnInit {
  newUserName = signal('');
  newUserEmail = signal('');

  constructor() { }

  ngOnInit(): void {
    // Initialize page data if needed
  }

  onUserClick(user: User): void {
    // Handle user click - update store
  }

  onUserDelete(user: User): void {
    // Handle user delete - call store action
    // Note: You would implement delete in store/service
    console.log('Delete user:', user);
  }

  async onAddUser(): Promise<void> {
    if (!this.newUserName().trim() || !this.newUserEmail().trim()) {
      return;
    }

    // Clear form
    this.newUserName.set('');
    this.newUserEmail.set('');
  }
}

