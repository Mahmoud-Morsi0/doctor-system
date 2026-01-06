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
  protected readonly currentView = signal<CalendarView>('weekly');

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

  // Available status options (labels will be translated in template)
  protected readonly statusOptions: { value: AppointmentStatus }[] = [
    { value: 'COMPLETE' },
    { value: 'UPCOMING' },
    { value: 'PENDING' },
    { value: 'CANCEL' },
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
   * Generate days for weekly view (Sunday to Saturday)
   */
  private generateWeekDays(date: Date): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get Sunday of the week (start of week)
    const sunday = this.getSunday(date);
    sunday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(sunday);
      dayDate.setDate(sunday.getDate() + i);
      dayDate.setHours(0, 0, 0, 0);
      const dayAppointments = this.getAppointmentsForDate(dayDate);

      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: this.isSameDay(dayDate, today),
        appointments: dayAppointments,
      });
    }

    return days;
  }

  /**
   * Get Sunday of the week for a given date
   */
  private getSunday(date: Date): Date {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = date.getDate() - day; // Subtract days to get to Sunday
    return new Date(date.setDate(diff));
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
   * Generate time slots for the day (hourly from 12:00 AM to 11:00 PM)
   * Localized AM/PM indicators
   */
  protected getTimeSlots(): string[] {
    const slots: string[] = ['All Day'];
    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    const isArabic = this.languageService.currentLanguage() === 'ar';

    for (let hour = 0; hour < 24; hour++) {
      const date = new Date();
      date.setHours(hour, 0, 0, 0);

      // Use Intl.DateTimeFormat for proper localization
      const timeString = date.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      slots.push(timeString);
    }
    return slots;
  }

  /**
   * Get appointments for a specific day and time slot
   */
  protected getAppointmentsForTimeSlot(day: Date, timeSlot: string): Appointment[] {
    if (timeSlot === 'All Day') {
      // Return all-day appointments (or appointments without specific time)
      return this.getAppointmentsForDate(day).filter(apt => !apt.startTime || apt.startTime === '');
    }

    // Parse time slot to hour
    const hour = this.parseTimeSlotToHour(timeSlot);
    if (hour === null) return [];

    // Get appointments that fall within this hour
    return this.getAppointmentsForDate(day).filter(apt => {
      if (!apt.startTime) return false;
      const aptHour = this.parseTimeToHour(apt.startTime);
      return aptHour === hour;
    });
  }

  /**
   * Parse time slot string to hour (0-23)
   * Handles both English (AM/PM) and Arabic (ص/م) formats, as well as localized formats from Intl
   */
  private parseTimeSlotToHour(timeSlot: string): number | null {
    // Try English format first (AM/PM)
    let match = timeSlot.match(/(\d+):\d+\s*(AM|PM)/i);
    if (match) {
      let hour = parseInt(match[1], 10);
      const period = match[2].toUpperCase();

      if (period === 'AM') {
        return hour === 12 ? 0 : hour;
      } else {
        return hour === 12 ? 12 : hour + 12;
      }
    }

    // Try Arabic format (ص/م) - صباحاً (AM) / مساءً (PM)
    match = timeSlot.match(/(\d+):\d+\s*(ص|م)/);
    if (match) {
      let hour = parseInt(match[1], 10);
      const period = match[2];

      if (period === 'ص') { // صباحاً (AM)
        return hour === 12 ? 0 : hour;
      } else { // مساءً (PM)
        return hour === 12 ? 12 : hour + 12;
      }
    }

    // Fallback: try to parse as 24-hour format (HH:mm)
    match = timeSlot.match(/(\d+):\d+/);
    if (match) {
      const hour = parseInt(match[1], 10);
      if (hour >= 0 && hour < 24) {
        return hour;
      }
    }

    return null;
  }

  /**
   * Parse time string (HH:mm) to hour (0-23)
   */
  private parseTimeToHour(time: string): number {
    const [hours] = time.split(':').map(Number);
    return hours;
  }

  /**
   * Format time from 24-hour format (HH:mm) to 12-hour format (h:mm AM/PM)
   * Localized AM/PM indicators based on current language
   */
  protected formatTime(time: string): string {
    if (!time || time === '') return '';

    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    const [hours, minutes] = time.split(':').map(Number);

    // Create a date object with the time
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Use Intl.DateTimeFormat for proper localization
    return date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Get events grouped by exact start time for a specific day
   * This helps calculate offsets for overlapping events (same start time)
   */
  protected getGroupedEventsByTime(day: Date): Map<string, Appointment[]> {
    const appointments = this.getAppointmentsForDate(day).filter(apt => apt.startTime && apt.startTime !== '');
    const grouped = new Map<string, Appointment[]>();

    appointments.forEach(apt => {
      const timeKey = apt.startTime;
      if (!grouped.has(timeKey)) {
        grouped.set(timeKey, []);
      }
      grouped.get(timeKey)!.push(apt);
    });

    return grouped;
  }

  /**
   * Get the index of an event within its time group (only for events with exact same start time)
   */
  protected getEventIndexInGroup(day: Date, appointment: Appointment): number {
    const grouped = this.getGroupedEventsByTime(day);
    const timeKey = appointment.startTime || '';
    const eventsAtSameTime = grouped.get(timeKey) || [];

    // Only return index if there are multiple events at the exact same time
    if (eventsAtSameTime.length <= 1) {
      return 0;
    }

    // Sort by ID to ensure consistent ordering
    const sorted = [...eventsAtSameTime].sort((a, b) => a.id.localeCompare(b.id));
    return sorted.findIndex(apt => apt.id === appointment.id);
  }

  /**
   * Check if two appointments overlap in time
   */
  private doAppointmentsOverlap(apt1: Appointment, apt2: Appointment): boolean {
    if (!apt1.startTime || !apt2.startTime) return false;

    const [h1, m1] = apt1.startTime.split(':').map(Number);
    const [h2, m2] = apt2.startTime.split(':').map(Number);

    const start1 = h1 * 60 + m1;
    const end1 = start1 + apt1.durationMinutes;
    const start2 = h2 * 60 + m2;
    const end2 = start2 + apt2.durationMinutes;

    // Check if they overlap: start1 < end2 && start2 < end1
    return start1 < end2 && start2 < end1;
  }

  /**
   * Get overlapping events for a given appointment
   */
  private getOverlappingEvents(day: Date, appointment: Appointment): Appointment[] {
    const allAppointments = this.getAppointmentsForDate(day).filter(apt => apt.startTime && apt.startTime !== '');
    return allAppointments.filter(apt => apt.id !== appointment.id && this.doAppointmentsOverlap(apt, appointment));
  }

  /**
   * Calculate event position and height based on start time and duration
   * Position is calculated relative to the day container (which includes All Day + 24 hour slots)
   * Also handles stacking of events with the same start time
   */
  protected getEventStyle(day: Date, appointment: Appointment): { top: string; height: string; left?: string; width?: string; right?: string } {
    if (!appointment.startTime || appointment.startTime === '') {
      return { top: '0px', height: '60px' }; // All-day event (first slot)
    }

    const [hours, minutes] = appointment.startTime.split(':').map(Number);
    const durationHours = appointment.durationMinutes / 60;

    // Each time slot is 60px (min-h-[60px])
    const slotHeight = 60; // Each hour slot height in pixels
    const allDaySlotHeight = 60; // All Day slot height

    // Calculate top position: All Day slot + (hour * slotHeight) + (minutes/60 * slotHeight)
    const topPixels = allDaySlotHeight + (hours * slotHeight) + (minutes / 60 * slotHeight);

    // Calculate height based on duration
    const heightPixels = Math.max((durationHours * slotHeight), 55); // Minimum 30px height

    // Handle overlapping events - only stack horizontally if they truly overlap
    // Sequential events (e.g., 10:00 and 10:30) should be positioned vertically
    const grouped = this.getGroupedEventsByTime(day);
    const eventsAtSameExactTime = grouped.get(appointment.startTime) || [];
    const eventIndex = this.getEventIndexInGroup(day, appointment);
    const totalEventsAtSameTime = eventsAtSameExactTime.length;

    // Only stack horizontally if multiple events have the EXACT same start time
    // Sequential events (different start times) will be positioned vertically based on their actual times
    if (totalEventsAtSameTime > 1) {
      // Multiple events at the exact same time - stack them horizontally
      // Use percentage-based positioning with small gaps
      const gapPercent = 0.5; // Small gap as percentage (0.5% between events)
      const marginPercent = 1; // Margin from edges (1%)
      const totalGaps = (totalEventsAtSameTime - 1) * gapPercent;
      const availableWidth = 100 - (marginPercent * 2) - totalGaps;
      const eventWidthPercent = availableWidth / totalEventsAtSameTime;

      // Calculate left position: margin + (index * (width + gap))
      const leftPercent = marginPercent + (eventIndex * (eventWidthPercent + gapPercent));

      return {
        top: `${topPixels}px`,
        height: `${heightPixels}px`,
        left: `${leftPercent}%`,
        width: `${eventWidthPercent}%`,
      };
    }

    // Single event or sequential event - use full width with margins
    // Sequential events will be positioned vertically based on their actual start times
    return {
      top: `${topPixels}px`,
      height: `${heightPixels}px`,
      left: '8px',
      width: 'calc(100% - 16px)',
    };
  }

  /**
   * Get day names for week view (Sunday to Saturday)
   */
  protected getWeekDayNames(): string[] {
    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    const date = new Date(2024, 0, 7); // January 7, 2024 is a Sunday
    const dayNames: string[] = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(date);
      dayDate.setDate(date.getDate() + i);
      const dayName = dayDate.toLocaleDateString(locale, { weekday: 'long' });
      dayNames.push(dayName.toUpperCase());
    }

    return dayNames;
  }

  /**
   * Get formatted day header (e.g., "SUNDAY 4")
   */
  protected getDayHeader(day: Date): string {
    const locale = this.languageService.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    const dayName = day.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase();
    const dayNumber = day.getDate();
    return `${dayName} ${dayNumber}`;
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
  protected getAppointmentsForDate(date: Date): Appointment[] {
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
   * Get status label for display (localized)
   */
  getStatusLabel(status: AppointmentStatus): string {
    // Map status to translation key (using scoped translations)
    const statusKeyMap: Record<AppointmentStatus, string> = {
      'COMPLETE': 'status.complete',
      'UPCOMING': 'status.upcoming',
      'PENDING': 'status.pending',
      'CANCEL': 'status.cancel',
    };

    const translationKey = statusKeyMap[status];
    if (translationKey) {
      // Use scoped translation (scope: 'appointment')
      return this.t.translate(translationKey, {}, 'appointment');
    }
    return status;
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
      // Go to previous Sunday
      const sunday = this.getSunday(date);
      sunday.setDate(sunday.getDate() - 7);
      this.currentDate.set(sunday);
      this.generateCalendarDays();
      return;
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
      // Go to next Sunday
      const sunday = this.getSunday(date);
      sunday.setDate(sunday.getDate() + 7);
      this.currentDate.set(sunday);
      this.generateCalendarDays();
      return;
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

