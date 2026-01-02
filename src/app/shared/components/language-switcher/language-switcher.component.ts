import { Component, inject, Input } from '@angular/core';
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
    <div 
      class="flex w-full items-center gap-1.5 transition-[flex-direction,gap] duration-200 ease-in-out"
      [class.flex-col]="isCollapsed"
      [class.items-stretch]="isCollapsed"
      [class.gap-1]="isCollapsed"
      [attr.dir]="languageService.isRTL() ? 'rtl' : 'ltr'"
      [class.flex-row-reverse]="languageService.isRTL() && !isCollapsed"
    >
      @for (lang of languages; track lang.code) {
        <button
          type="button"
          class="relative flex-1 rounded-md border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          [class.flex-none]="isCollapsed"
          [class.min-w-0]="isCollapsed"
          [class.p-1.5]="isCollapsed"
          [class.text-[10px]]="isCollapsed"
          [class.border-white/20]="languageService.currentLanguage() !== lang.code"
          [class.bg-white/10]="languageService.currentLanguage() !== lang.code"
          [class.text-slate-300]="languageService.currentLanguage() !== lang.code"
          [class.hover:border-white/30]="languageService.currentLanguage() !== lang.code"
          [class.hover:bg-white/15]="languageService.currentLanguage() !== lang.code"
          [class.bg-blue-600]="languageService.currentLanguage() === lang.code"
          [class.border-blue-500]="languageService.currentLanguage() === lang.code"
          [class.text-white]="languageService.currentLanguage() === lang.code"
          [class.shadow-md]="languageService.currentLanguage() === lang.code"
          [class.shadow-blue-500/50]="languageService.currentLanguage() === lang.code"
          [class.hover:bg-blue-700]="languageService.currentLanguage() === lang.code"
          [class.hover:border-blue-400]="languageService.currentLanguage() === lang.code"
          [class.active:scale-95]="languageService.currentLanguage() === lang.code"
          [class.cursor-not-allowed]="languageService.currentLanguage() === lang.code"
          [class.opacity-100]="languageService.currentLanguage() === lang.code"
          (click)="switchLanguage(lang.code)"
          [attr.aria-label]="lang.label"
          [attr.aria-pressed]="languageService.currentLanguage() === lang.code"
          [title]="isCollapsed ? lang.label : ''"
        >
          <span class="block">{{ lang.label }}</span>
          @if (languageService.currentLanguage() === lang.code && !isCollapsed) {
            <span class="absolute -top-1 -right-1 flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
          }
        </button>
      }
    </div>
  `
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);
  
  // Input to receive collapsed state from parent
  @Input() isCollapsed = false;

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
