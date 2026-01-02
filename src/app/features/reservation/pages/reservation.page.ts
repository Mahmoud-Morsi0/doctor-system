import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ButtonModule, TranslocoModule],
  templateUrl: './reservation.page.html',
})
export class ReservationPage {}
