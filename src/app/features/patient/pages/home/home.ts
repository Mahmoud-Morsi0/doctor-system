import { Component, inject, signal } from '@angular/core';
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
export class Home {

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  t = inject(TranslocoService);
  // Drawer visibility
  visible = signal(false);

  // New patient dialog visibility
  newPatientVisible = signal(false);

  // Edit patient dialog visibility
  editPatientVisible = signal(false);

  // Delete patient dialog visibility
  deletePatientVisible = signal(false);
  searchValue = signal('');

  // Table data
  patients = signal<Patient[]>([
    {
      id: 'BN000',
      name: 'Trịnh Quang Vinh',
      dateOfBirth: '00/00/00',
      gender: 'Male',
      assignedDentist: { name: 'Dr. Duyen' },
      phoneNumber: '090 000 001',
      nextAppointment: '00/00/00',
      status: 'Active',
    },
    {
      id: 'BN000',
      name: 'Lâm Tuyết Ngân',
      dateOfBirth: '00/00/00',
      gender: 'Female',
      assignedDentist: { name: 'Dr. Tuan' },
      phoneNumber: '090 000 002',
      nextAppointment: '00/00/00',
      status: 'Active',
    },
    {
      id: 'BN000',
      name: 'Đào Phương Linh',
      dateOfBirth: '00/00/00',
      gender: 'Female',
      assignedDentist: { name: 'Dr. Hung' },
      phoneNumber: '090 000 003',
      nextAppointment: '---',
      status: 'Active',
    },
    {
      id: 'BN000',
      name: 'Lê Hoàng Anh',
      dateOfBirth: '00/00/00',
      gender: 'Male',
      assignedDentist: { name: 'Dr. Duyen' },
      phoneNumber: '090 000 004',
      nextAppointment: '00/00/00',
      status: 'Inactive',
    },
    {
      id: 'BN000',
      name: 'Hồ Văn Khánh',
      dateOfBirth: '00/00/00',
      gender: 'Male',
      assignedDentist: { name: 'Dr. Tuan' },
      phoneNumber: '090 000 005',
      nextAppointment: '00/00/00',
      status: 'Active',
    },
    {
      id: 'BN000',
      name: 'Chu Thanh Hiền',
      dateOfBirth: '00/00/00',
      gender: 'Female',
      assignedDentist: { name: 'Dr. Hung' },
      phoneNumber: '090 000 006',
      nextAppointment: '00/00/00',
      status: 'Active',
    },
    {
      id: 'BN000',
      name: 'Tống Nhật Minh',
      dateOfBirth: '00/00/00',
      gender: 'Male',
      assignedDentist: { name: 'Dr. Duyen' },
      phoneNumber: '090 000 007',
      nextAppointment: '---',
      status: 'Inactive',
    },
    {
      id: 'BN000',
      name: 'Đỗ Xuân Mai',
      dateOfBirth: '00/00/00',
      gender: 'Female',
      assignedDentist: { name: 'Dr. Tuan' },
      phoneNumber: '090 000 008',
      nextAppointment: '00/00/00',
      status: 'Active',
    },
    {
      id: 'BN000',
      name: 'Lý Bảo Nam',
      dateOfBirth: '00/00/00',
      gender: 'Male',
      assignedDentist: { name: 'Dr. Hung' },
      phoneNumber: '090 000 009',
      nextAppointment: '00/00/00',
      status: 'Active',
    },
    {
      id: 'BN000',
      name: 'Hoàng Hải Đăng',
      dateOfBirth: '00/00/00',
      gender: 'Male',
      assignedDentist: { name: 'Dr. Duyen' },
      phoneNumber: '090 000 010',
      nextAppointment: '00/00/00',
      status: 'Active',
    },
  ]);

  // Pagination
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(372);

  // Filtered patients based on search
  filteredPatients = signal<Patient[]>(this.patients());

  /**
   * Filter patients based on search input
   */
  onSearch(): void {
    const search = this.searchValue().toLowerCase().trim();
    if (!search) {
      this.filteredPatients.set(this.patients());
      return;
    }

    const filtered = this.patients().filter(
      (patient) =>
        patient.name.toLowerCase().includes(search) ||
        patient.id.toLowerCase().includes(search)
    );
    this.filteredPatients.set(filtered);
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
