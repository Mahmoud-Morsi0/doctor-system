import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment.interface';
import { appointments } from '../data/appointment';

/**
 * Appointment Service
 * 
 * Handles appointment data operations.
 * In a real application, this would make HTTP calls to an API.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  /**
   * Get all appointments
   */
  getAppointments(): Observable<Appointment[]> {
    return of(appointments);
  }

  /**
   * Get appointments for a specific date range
   */
  getAppointmentsByDateRange(startDate: Date, endDate: Date): Observable<Appointment[]> {
    const filtered = appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= startDate && aptDate <= endDate;
    });
    return of(filtered);
  }

  /**
   * Get appointments for a specific date
   */
  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    const dateStr = date.toISOString().split('T')[0];
    const filtered = appointments.filter((apt) => apt.date === dateStr);
    return of(filtered);
  }
}

