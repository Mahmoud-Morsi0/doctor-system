/**
 * Appointment Interface
 *
 * Defines the structure for appointment/calendar entries
 */
export interface Appointment {
  id: string;
  patientName: string;
  patientId?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // Time string (HH:mm)
  endTime?: string; // Time string (HH:mm)
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  clinic?: {
    id: string;
    name: string;
    room?: string;
  };
  dentist?: {
    id: string;
    name: string;
  };
}

/**
 * Appointment Status
 * Maps to color coding in the calendar
 */
export type AppointmentStatus = 'COMPLETE' | 'UPCOMING' | 'PENDING' | 'CANCEL';

/**
 * Calendar View Type
 */
export type CalendarView = 'daily' | 'weekly' | 'monthly';

/**
 * Calendar Day
 * Represents a single day in the calendar grid
 */
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
  overflowCount?: number; // Number of appointments beyond the visible limit
}

/**
 * Pagination Event Interface
 */
export interface PaginationEvent {
  rows: number;
  page: number;
}

