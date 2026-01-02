import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

/**
 * Patient Home Component
 *
 * Uses scoped translations from /i18n/{lang}/patient.json
 * The *transloco directive automatically loads the scope when used
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Translations are loaded automatically by the *transloco directive
  // Access them in TypeScript: inject(TranslocoService).translate('title', {}, 'patient')
}
