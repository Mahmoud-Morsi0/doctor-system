import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../../core/services';

/**
 * Language Switcher Component
 *
 * A simple, reusable component for switching between languages.
 *
 * Features:
 * - Clean UI with EN/AR buttons
 * - Active language highlighting
 * - Accessible (ARIA labels)
 * - Standalone component (Angular 21 best practice)
 *
 * Usage:
 * <app-language-switcher></app-language-switcher>
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher" [attr.dir]="languageService.isRTL() ? 'rtl' : 'ltr'">
      @for (lang of languages; track lang.code) {
        <button
          type="button"
          [class.active]="languageService.currentLanguage() === lang.code"
          (click)="switchLanguage(lang.code)"
          [attr.aria-label]="lang.label"
          [attr.aria-pressed]="languageService.currentLanguage() === lang.code"
          class="lang-button"
        >
          {{ lang.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .lang-button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
      min-width: 60px;
    }

    .lang-button:hover {
      background: #f5f5f5;
      border-color: #999;
    }

    .lang-button:focus {
      outline: 2px solid #007bff;
      outline-offset: 2px;
    }

    .lang-button.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .lang-button.active:hover {
      background: #0056b3;
      border-color: #0056b3;
    }

    /* RTL support */
    .language-switcher[dir="rtl"] {
      flex-direction: row-reverse;
    }
  `]
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);

  protected readonly languages: Array<{ code: Language; label: string }> = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' }
  ];

  /**
   * Switch to the selected language
   * This will:
   * - Update Transloco active language
   * - Update HTML dir/lang attributes
   * - Save preference to localStorage
   * - Trigger re-render of all translated content
   */
  switchLanguage(language: Language): void {
    if (this.languageService.currentLanguage() === language) {
      return; // Already active
    }

    this.languageService.setLanguage(language);
  }
}
