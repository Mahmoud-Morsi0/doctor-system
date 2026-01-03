import { Component, computed, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { patients } from '../../data-access/data/patient';
import { Patient } from '../../data-access/models/patient.interface';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ButtonModule, TagModule, AvatarModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile implements OnInit {

  patientId = input<string>()

  protected readonly patient = computed<Patient | undefined>(() =>
    patients.find(patient => patient.id === this.patientId())
  );

  ngOnInit(): void {
    console.log('patientId', this.patientId());

  }

  /**
   * Get status severity for PrimeNG Tag
   */
  getStatusSeverity(status: string): 'success' | 'secondary' {
    return status === 'Active' ? 'success' : 'secondary';
  }

  /**
   * Navigate back to patient list
   */
  goBack(): void {
    window.history.back();
  }
}
