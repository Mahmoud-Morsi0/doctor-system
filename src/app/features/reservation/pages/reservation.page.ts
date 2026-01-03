import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { reservations } from '../data-access/data/reservation';
import { Subject } from 'rxjs';
import { PaginationEvent, Reservation } from '../data-access/models/reservation.interface';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LanguageService } from '../../../core/services/language.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ButtonModule, TableModule, TagModule, IconFieldModule, InputIconModule, InputTextModule, DrawerModule, ToastModule, ConfirmDialogModule],
  templateUrl: './reservation.page.html',
  providers: [ConfirmationService, MessageService]

})
export class ReservationPage {
  reservations = reservations;
  protected readonly messageService = inject(MessageService);
  protected readonly t = inject(TranslocoService);
  protected readonly confirmationService = inject(ConfirmationService);
  searchValue = signal('');
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();
  private readonly paginationSubject = new Subject<PaginationEvent>();
  protected readonly drawerPosition = computed(() => (this.languageService.isRTL() ? 'left' : 'right'));
  protected readonly languageService = inject(LanguageService);
  protected readonly visible = signal(false);
  protected readonly newReservationVisible = signal(false);
  protected readonly editReservationVisible = signal(false);
  deleteReservationVisible = signal(false);
  readonly pagination$ = this.paginationSubject.asObservable();
  filteredReservations = signal<Reservation[]>(reservations);

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warn';
      case 'CANCELLED':
        return 'danger';
      case 'COMPLETED':
        return 'info';
      default:
        return 'secondary';
    }
  }


  /**
 * Handle search input changes - triggers debounced search
 */
  onSearchInput(value: string): void {
    this.searchValue.set(value);
    this.searchSubject.next(value);
  }

  /**
   * Perform the actual search filtering
   * This is called after debounce delay
   */
  private performSearch(searchTerm: string): void {
    const search = searchTerm.toLowerCase().trim();
    if (!search) {
      this.filteredReservations.set(reservations);
      return;
    }

    const filtered = reservations.filter(
      (reservation) =>
        reservation.patient.name.toLowerCase().includes(search) ||
        reservation.patient.id.toLowerCase().includes(search) ||
        reservation.patient.phone.toLowerCase().includes(search)
    );
    this.filteredReservations.set(filtered);
  }

  /**
   * Clear search and reset filtered patients
   */
  clearSearch(): void {
    this.searchValue.set('');
    this.searchSubject.next('');
  }
}
