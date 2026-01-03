import { Component, computed, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { LanguageService } from '../../../../core/services';
import { patients } from '../../data-access/data/patient';
import { Patient } from '../../data-access/models/patient.interface';

/**
 * Patient Profile Page
 * 
 * Displays comprehensive patient information with tabs for:
 * - Information (Personal, Medical, Insurance)
 * - Check-up History
 * - Digital Notes
 * - Billing History
 */
@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ButtonModule, TagModule, AvatarModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly languageService = inject(LanguageService);

  protected readonly patientId = computed(() => this.route.snapshot.paramMap.get('patientId') || '');
  protected readonly patient = computed<Patient | undefined>(() => 
    patients.find(patient => patient.id === this.patientId())
  );

  // Active tab
  protected readonly activeTab = signal<'information' | 'checkup' | 'notes' | 'billing'>('information');

  // Edit mode
  protected readonly isEditMode = signal(false);

  ngOnInit(): void {
    if (!this.patient()) {
      // Patient not found, redirect back to list
      this.router.navigate(['/patients']);
    }
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: 'information' | 'checkup' | 'notes' | 'billing'): void {
    this.activeTab.set(tab);
  }

  /**
   * Toggle edit mode
   */
  toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());
  }

  /**
   * Navigate back to patient list
   */
  goBack(): void {
    this.router.navigate(['/patients']);
  }

  /**
   * Get status severity for PrimeNG Tag
   */
  getStatusSeverity(status: string): 'success' | 'secondary' {
    return status === 'Active' ? 'success' : 'secondary';
  }
}
