import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.interface';

/**
 * Appointment API
 * 
 * Handles HTTP requests for appointment operations.
 * This is the data access layer that communicates with the backend.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentApi {
  private readonly baseUrl = '/api/appointments';

  constructor(private http: HttpClient) {}

  /**
   * Get all appointments
   */
  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl);
  }

  /**
   * Get appointment by ID
   */
  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new appointment
   */
  create(appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, appointment);
  }

  /**
   * Update appointment
   */
  update(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${id}`, appointment);
  }

  /**
   * Delete appointment
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

