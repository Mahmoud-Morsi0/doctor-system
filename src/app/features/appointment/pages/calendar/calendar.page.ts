import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { LanguageService } from '../../../../core/services';
import { Appointment, AppointmentStatus, CalendarDay, CalendarView } from '../../data-access/models/appointment.interface';
import { appointments } from '../../data-access/data/appointment';
import { Subject, takeUntil } from 'rxjs';

/**
 * Calendar Page Component
 *
 * Displays appointment calendar with monthly/weekly/daily views.
 * Features:
 * - Calendar grid with appointments
 * - View switcher (Daily/Weekly/Monthly)
 * - Date navigation (Today, Previous, Next)
 * - Status legend
 * - Create appointment button
 */
@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule, ButtonModule, DrawerModule, TagModule],
  templateUrl: './calendar.page.html',
  styleUrl: './calendar.page.css',
})
export class CalendarPage implements OnInit, OnDestroy {
  protected readonly t = inject(TranslocoService);
  protected readonly languageService = inject(LanguageService);

  // Drawer position based on language direction
  protected readonly drawerPosition = computed(() => (this.languageService.isRTL() ? 'left' : 'right'));

  // Current view (daily/weekly/monthly)
  protected readonly currentView = signal<CalendarView>('monthly');

  // Current date (used for navigation)
  protected readonly currentDate = signal<Date>(new Date()); // January 1, 2026

  // Calendar days for the current view
  protected readonly calendarDays = signal<CalendarDay[]>([]);

  // Drawer visibility
  protected readonly visible = signal(false);

  // Day appointments drawer visibility
  protected readonly dayAppointmentsVisible = signal(false);

  // Selected day for viewing appointments
  protected readonly selectedDay = signal<Date | null>(null);

  // Date picker visibility
  protected readonly datePickerVisible = signal(false);

  // All appointments
  protected readonly appointments = signal<Appointment[]>(appointments);

  // Available status options
  protected readonly statusOptions: { label: string; value: AppointmentStatus }[] = [
    { label: 'Complete', value: 'COMPLETE' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Cancel', value: 'CANCEL' },
  ];

  // Get all appointments for the selected day
  protected readonly selectedDayAppointments = computed(() => {
    const day = this.selectedDay();
    if (!day) return [];
    return this.getAppointmentsForDate(day);
  });

  // Get formatted date string for selected day (localized)
  protected readonly selectedDayFormatted = computed(() => {
    const day = this.selectedDay();
    if (!day) return '';
    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    return day.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  private readonly destroy$ = new Subject<void>();
  private readonly clickOutsideHandler = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const datePickerContainer = document.querySelector('[data-date-picker-container]');
    if (datePickerContainer && !datePickerContainer.contains(target)) {
      this.datePickerVisible.set(false);
    }
  };

  /**
   * Initialize calendar
   */
  ngOnInit(): void {
    this.generateCalendarDays();
    // Close date picker when clicking outside
    setTimeout(() => {
      document.addEventListener('click', this.clickOutsideHandler);
    }, 0);

    // Regenerate calendar when language changes
    this.languageService.language$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.generateCalendarDays();
    });
  }

  /**
   * Clean up subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  /**
   * Generate calendar days based on current view and date
   */
  generateCalendarDays(): void {
    const view = this.currentView();
    const date = this.currentDate();
    const days: CalendarDay[] = [];

    if (view === 'monthly') {
      days.push(...this.generateMonthDays(date));
    } else if (view === 'weekly') {
      days.push(...this.generateWeekDays(date));
    } else {
      days.push(...this.generateDayView(date));
    }

    this.calendarDays.set(days);
  }

  /**
   * Generate days for monthly view
   */
  private generateMonthDays(date: Date): CalendarDay[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // First day of the week (Sunday = 0, Monday = 1, etc.)
    const startDay = firstDay.getDay();
    // Adjust to Monday = 0 (if Sunday, make it 6)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    const days: CalendarDay[] = [];

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: dayDate,
        isCurrentMonth: false,
        isToday: this.isSameDay(dayDate, today),
        appointments: this.getAppointmentsForDate(dayDate),
      });
    }

    // Add days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayDate = new Date(year, month, day);
      const dayAppointments = this.getAppointmentsForDate(dayDate);
      const visibleAppointments = dayAppointments.slice(0, 2);
      const overflowCount = dayAppointments.length > 2 ? dayAppointments.length - 2 : undefined;

      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: this.isSameDay(dayDate, today),
        appointments: visibleAppointments,
        overflowCount,
      });
    }

    // Add days from next month to fill the grid (42 days total for 6 weeks)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const dayDate = new Date(year, month + 1, day);
      days.push({
        date: dayDate,
        isCurrentMonth: false,
        isToday: this.isSameDay(dayDate, today),
        appointments: this.getAppointmentsForDate(dayDate),
      });
    }

    return days;
  }

  /**
   * Generate days for weekly view
   */
  private generateWeekDays(date: Date): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get Monday of the week
    const monday = this.getMonday(date);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      dayDate.setHours(0, 0, 0, 0);
      const dayAppointments = this.getAppointmentsForDate(dayDate);
      const visibleAppointments = dayAppointments.slice(0, 2);
      const overflowCount = dayAppointments.length > 2 ? dayAppointments.length - 2 : undefined;

      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: this.isSameDay(dayDate, today),
        appointments: visibleAppointments,
        overflowCount,
      });
    }

    return days;
  }

  /**
   * Generate day view (single day)
   */
  private generateDayView(date: Date): CalendarDay[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(date);
    dayDate.setHours(0, 0, 0, 0);
    const dayAppointments = this.getAppointmentsForDate(dayDate);

    return [{
      date: dayDate,
      isCurrentMonth: true,
      isToday: this.isSameDay(dayDate, today),
      appointments: dayAppointments,
    }];
  }

  /**
   * Get Monday of the week for a given date
   */
  private getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  /**
   * Check if two dates are the same day
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Get appointments for a specific date
   * Formats date as YYYY-MM-DD using local timezone to avoid UTC conversion issues
   */
  private getAppointmentsForDate(date: Date): Appointment[] {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return this.appointments().filter((apt) => apt.date === dateStr);
  }

  /**
   * Open day appointments drawer
   */
  openDayAppointments(day: Date): void {
    this.selectedDay.set(day);
    this.dayAppointmentsVisible.set(true);
  }

  /**
   * Close day appointments drawer
   */
  closeDayAppointments(): void {
    this.dayAppointmentsVisible.set(false);
    this.selectedDay.set(null);
  }

  /**
   * Change appointment status
   */
  changeAppointmentStatus(appointmentId: string, newStatus: AppointmentStatus): void {
    const appointments = this.appointments();
    const updatedAppointments = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    this.appointments.set(updatedAppointments);
    this.generateCalendarDays(); // Regenerate calendar to reflect changes
  }

  /**
   * Get status label for display
   */
  getStatusLabel(status: AppointmentStatus): string {
    const option = this.statusOptions.find((opt) => opt.value === status);
    return option?.label || status;
  }

  /**
   * Get status severity for PrimeNG Tag
   */
  getStatusSeverity(status: AppointmentStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'COMPLETE':
        return 'success';
      case 'UPCOMING':
        return 'info';
      case 'PENDING':
        return 'warn';
      case 'CANCEL':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  /**
   * Change calendar view
   */
  setView(view: CalendarView): void {
    this.currentView.set(view);
    this.generateCalendarDays();
  }

  /**
   * Navigate to previous period
   */
  previousPeriod(): void {
    const date = new Date(this.currentDate());
    const view = this.currentView();

    if (view === 'monthly') {
      date.setMonth(date.getMonth() - 1);
    } else if (view === 'weekly') {
      date.setDate(date.getDate() - 7);
    } else {
      date.setDate(date.getDate() - 1);
    }

    this.currentDate.set(date);
    this.generateCalendarDays();
  }

  /**
   * Navigate to next period
   */
  nextPeriod(): void {
    const date = new Date(this.currentDate());
    const view = this.currentView();

    if (view === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (view === 'weekly') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setDate(date.getDate() + 1);
    }

    this.currentDate.set(date);
    this.generateCalendarDays();
  }

  /**
   * Navigate to today
   */
  goToToday(): void {
    this.currentDate.set(new Date());
    this.generateCalendarDays();
  }

  /**
   * Get formatted date string for display (localized)
   */
  getFormattedDate(): string {
    const date = this.currentDate();
    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    return date.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Get status color class
   */
  getStatusColorClass(status: AppointmentStatus): string {
    switch (status) {
      case 'COMPLETE':
        return 'border-l-green-500 bg-green-50';
      case 'UPCOMING':
        return 'border-l-blue-500 bg-blue-50';
      case 'PENDING':
        return 'border-l-orange-500 bg-orange-50';
      case 'CANCEL':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-slate-500 bg-slate-50';
    }
  }

  /**
   * Get status dot color
   */
  getStatusDotColor(status: AppointmentStatus): string {
    switch (status) {
      case 'COMPLETE':
        return 'bg-green-500';
      case 'UPCOMING':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-orange-500';
      case 'CANCEL':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  }

  /**
   * Get day names for calendar header (localized)
   */
  getDayNames(): string[] {
    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    const date = new Date(2024, 0, 1); // Use a known Monday (Jan 1, 2024 is a Monday)
    const dayNames: string[] = [];

    // Generate day names starting from Monday
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(date);
      dayDate.setDate(date.getDate() + i);
      const dayName = dayDate.toLocaleDateString(locale, { weekday: 'short' });
      dayNames.push(dayName);
    }

    return dayNames;
  }

  /**
   * Open create appointment drawer
   */
  openCreateDrawer(): void {
    this.visible.set(true);
  }

  /**
   * Get date value for date input (YYYY-MM-DD format)
   */
  getDateInputValue(): string {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Handle date input change
   */
  onDateInputChange(dateString: string): void {
    if (dateString) {
      const selectedDate = new Date(dateString);
      selectedDate.setHours(0, 0, 0, 0);
      this.currentDate.set(selectedDate);
      this.generateCalendarDays();
      this.datePickerVisible.set(false); // Close picker after selection
    }
  }
}

