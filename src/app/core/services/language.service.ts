import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'ar';

/**
 * Language Service
 *
 * Handles language switching, RTL/LTR direction, and language persistence.
 * Integrates with Transloco for translation management.
 *
 * Why this approach:
 * - Centralized language management
 * - Automatic RTL/LTR switching for Arabic
 * - Persists user preference in localStorage
 * - SSR-safe (checks for browser APIs before using)
 * - Observable-based for reactive updates
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly translocoService = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);

  // Current language signal (reactive)
  private readonly _currentLanguage = signal<Language>('en');

  // Observable for current language (for components that prefer observables)
  private readonly _language$ = new BehaviorSubject<Language>('en');

  // Computed properties
  readonly currentLanguage = computed(() => this._currentLanguage());
  readonly isRTL = computed(() => this._currentLanguage() === 'ar');
  readonly language$: Observable<Language> = this._language$.asObservable();

  constructor() {
    // Initialize language on service creation
    this.initializeLanguage();

    // Effect to update HTML attributes when language changes
    // This ensures dir and lang attributes are always in sync
    effect(() => {
      const lang = this._currentLanguage();
      this.updateDocumentAttributes(lang);
      this._language$.next(lang);
    });
  }

  /**
   * Initialize language from:
   * 1. localStorage (user preference)
   * 2. Browser language
   * 3. Default to 'en'
   */
  private initializeLanguage(): void {
    // SSR-safe: Check if we're in browser
    if (typeof window === 'undefined') {
      return;
    }

    const savedLanguage = localStorage.getItem('language') as Language;
    const browserLanguage = this.getBrowserLanguage();

    const initialLanguage: Language =
      (savedLanguage && this.isValidLanguage(savedLanguage))
        ? savedLanguage
        : (this.isValidLanguage(browserLanguage) ? browserLanguage : 'en');

    this.setLanguage(initialLanguage, false); // Don't save on init
  }

  /**
   * Get browser language (first 2 characters)
   */
  private getBrowserLanguage(): string {
    if (typeof navigator === 'undefined') {
      return 'en';
    }
    return navigator.language.split('-')[0].toLowerCase();
  }

  /**
   * Validate if language is supported
   */
  private isValidLanguage(lang: string): lang is Language {
    return lang === 'en' || lang === 'ar';
  }

  /**
   * Set active language
   * @param language - Language code ('en' or 'ar')
   * @param persist - Whether to save to localStorage (default: true)
   */
  setLanguage(language: Language, persist: boolean = true): void {
    if (!this.isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}. Defaulting to 'en'`);
      language = 'en';
    }

    // Update signal (triggers effect)
    this._currentLanguage.set(language);

    // Update Transloco active language
    // This loads the translation files for the selected language
    this.translocoService.setActiveLang(language);

    // Persist preference
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }

  /**
   * Update HTML document attributes for RTL/LTR and language
   * This is crucial for:
   * - CSS direction support
   * - Screen reader accessibility
   * - SEO
   */
  private updateDocumentAttributes(language: Language): void {
    if (typeof document === 'undefined') {
      return; // SSR-safe
    }

    const htmlElement = this.document.documentElement;
    const isRTL = language === 'ar';

    // Set language attribute (for screen readers and SEO)
    htmlElement.setAttribute('lang', language);

    // Set direction attribute (critical for RTL languages)
    htmlElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    // Add/remove RTL class for CSS targeting
    if (isRTL) {
      htmlElement.classList.add('rtl');
      htmlElement.classList.remove('ltr');
    } else {
      htmlElement.classList.add('ltr');
      htmlElement.classList.remove('rtl');
    }
  }

  /**
   * Toggle between English and Arabic
   */
  toggleLanguage(): void {
    const newLanguage: Language = this._currentLanguage() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLanguage);
  }

  /**
   * Get current language code
   */
  getCurrentLanguage(): Language {
    return this._currentLanguage();
  }

  /**
   * Check if current language is RTL
   */
  getIsRTL(): boolean {
    return this.isRTL();
  }
}

