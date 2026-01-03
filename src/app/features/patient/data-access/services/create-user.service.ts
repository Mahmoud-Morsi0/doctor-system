/**
 * Services Layer - Create User Service
 *
 * Services handle business logic, NOT state.
 * Responsibilities:
 * ✓ Orchestration
 * ✓ Transforming API responses
 * ✓ Combining multiple API calls
 * ✓ Business logic
 * ✓ Filtering data
 * ✓ Data sanitization
 * ✓ Formatting
 * ✓ Calling APIs
 *
 * Rules:
 * ✗ They DO NOT share state
 * ✗ They do NOT control UI
 */

import { Injectable } from '@angular/core';
import { CreateUserRequest, CreateUserResponse } from '../models/patient.interface';
import { Observable, map } from 'rxjs';
import { CreateUserApi } from '../api';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {
  constructor(private createUserApi: CreateUserApi) { }

  createUser(user: { name: string; email: string }): Observable<User> {
    // Business logic: Validate email format
    if (!this.isValidEmail(user.email)) {
      throw new Error('Invalid email format');
    }

    // Transform data for API
    const request: CreateUserRequest = {
      name: user.name.trim(),
      email: user.email.toLowerCase().trim()
    };

    // Call API and transform response
    return this.createUserApi.createUser(request).pipe(
      map((response: CreateUserResponse) => ({
        id: response.id,
        name: response.name,
        email: response.email
      }))
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

