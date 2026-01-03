/**
 * API Layer - Create User
 *
 * The API Layer ONLY talks to the backend.
 * Responsibilities:
 * ✓ Making HTTP requests (fetch/axios)
 * ✓ Sending data to the server
 * ✓ Receiving data
 * ✓ Handling API responses
 * ✓ Typing API responses
 *
 * Rules:
 * ✗ No business logic
 * ✗ No transformations
 * ✗ No caching
 * ✗ No store
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientApi {
  constructor(private http: HttpClient) { }

  getPatients(request: Patient): Observable<Patient> {
    return this.http.post<Patient>('/api/users', request);
  }
}

