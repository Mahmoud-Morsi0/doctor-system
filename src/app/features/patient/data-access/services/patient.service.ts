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
import { Patient } from '../models/patient.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private patientService: PatientService) { }

  getPatients(request: Patient): Observable<Patient> {
    // Business logic: Validate email format
    // Call API and transform response
    return this.patientService.getPatients(request).pipe(
      map((response: Patient) => ({
        id: response.id,
        name: response.name,
        dateOfBirth: response.dateOfBirth,
        gender: response.gender,
        assignedDentist: response.assignedDentist,
        phoneNumber: response.phoneNumber,
        nextAppointment: response.nextAppointment,
        status: response.status
      }))
    );
  }
}

