import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { LanguageService } from '../../../../core/services';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { patients } from '../../data-access/data/patient';

/**
 * Patient Interface
 */
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  assignedDentist: {
    name: string;
    avatar?: string;
  };
  phoneNumber: string;
  nextAppointment: string;
  status: 'Active' | 'Inactive';
}

/**
 * Patient Home Component
 *
 * Displays a table of patients with search, filter, and pagination.
 * Uses scoped translations from /i18n/{lang}/patient.json
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    DrawerModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [ConfirmationService, MessageService]
})
export class Home implements OnInit, OnDestroy {
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  t = inject(TranslocoService);
  languageService = inject(LanguageService);

  // Drawer position based on language direction
  // Right for LTR (English), Left for RTL (Arabic)
  drawerPosition = computed(() => (this.languageService.isRTL() ? 'left' : 'right'));

  // Drawer visibility
  visible = signal(false);

  // New patient dialog visibility
  newPatientVisible = signal(false);

  // Edit patient dialog visibility
  editPatientVisible = signal(false);

  // Delete patient dialog visibility
  deletePatientVisible = signal(false);
  searchValue = signal('');

  // RxJS Subject for debounced search
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  // Table data
  patients = signal<Patient[]>(
    patients
  );

  // Pagination
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(372);

  // Filtered patients based on search
  filteredPatients = signal<Patient[]>(this.patients());

  /**
   * Initialize component and set up debounced search
   */
  ngOnInit(): void {
    // Set up debounced search subscription
    // Debounce for 300ms - waits for user to stop typing before searching
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only emit if value changed
        takeUntil(this.destroy$) // Clean up on component destroy
      )
      .subscribe((searchTerm) => {
        this.performSearch(searchTerm);
      });
  }

  /**
   * Clean up subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.filteredPatients.set(this.patients());
      return;
    }

    const filtered = this.patients().filter(
      (patient) =>
        patient.name.toLowerCase().includes(search) ||
        patient.id.toLowerCase().includes(search) ||
        patient.phoneNumber.toLowerCase().includes(search)
    );
    this.filteredPatients.set(filtered);
  }

  /**
   * Clear search and reset filtered patients
   */
  clearSearch(): void {
    this.searchValue.set('');
    this.searchSubject.next('');
  }

  /**
   * Handle pagination
   */
  onPageChange(event: any): void {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  /**
   * Get status severity for PrimeNG Tag
   */
  getStatusSeverity(status: string): 'success' | 'secondary' {
    return status === 'Active' ? 'success' : 'secondary';
  }

  /**
   * Export patients data
   */
  onExport(): void {
    console.log('Export patients');
    // TODO: Implement export functionality
  }

  /**
   * Open new patient dialog
   */
  onNewPatient(): void {
    console.log('New patient');
    // TODO: Implement new patient dialog
  }


  /**
   * Confirm delete patient
   */
  confirmDelete(event: Event): void {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: this.t.translate('patient.deleteConfirmation'),
      header: this.t.translate('patient.deleteConfirmationHeader'),
      icon: 'pi pi-info-circle',
      rejectLabel: this.t.translate('patient.cancel'),
      rejectButtonProps: {
        label: this.t.translate('patient.cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.t.translate('patient.delete'),
        severity: 'danger',
      },

      accept: () => {
        this.messageService.add({ severity: 'info', summary: this.t.translate('patient.confirmed'), detail: this.t.translate('patient.recordDeleted') });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: this.t.translate('patient.rejected'), detail: this.t.translate('patient.youHaveRejected') });
      },
    });
  }
}
