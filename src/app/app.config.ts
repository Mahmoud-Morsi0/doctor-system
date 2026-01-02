import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  provideTransloco,
  TranslocoService,
  TranslocoLoader,
  Translation,
} from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { inject } from '@angular/core';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { LanguageService } from './core/services';
import aura from '@primeuix/themes/aura';

/**
 * Transloco HTTP Loader
 *
 * Loads translation files dynamically based on the active language.
 * Supports both global translations and feature-scoped translations (lazy loading).
 *
 * Why this approach:
 * - Lazy loads translations only when needed (better performance)
 * - Supports feature-based translation files (scopes)
 * - SSR-safe (uses HttpClient which works in SSR)
 * - Production-ready error handling with fallback
 *
 * File structure:
 * - Global: /i18n/{lang}.json
 * - Scoped: /i18n/{lang}/{scope}.json (e.g., /i18n/en/dashboard.json)
 */
export class HttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(langOrScope: string): Observable<Translation> {
    // Check if this is a scoped translation (format: "scope/lang")
    if (langOrScope.includes('/')) {
      const [scope, lang] = langOrScope.split('/');
      return this.http.get<Translation>(`/i18n/${lang}/${scope}.json`);
    }

    // Regular global translation
    return this.http.get<Translation>(`/i18n/${langOrScope}.json`);
  }
}

/**
 * Initialize Transloco with saved language preference
 *
 * This ensures translations are loaded before the app renders,
 * preventing flash of untranslated content.
 *
 * Uses inject() for dependency injection (Angular 21+ pattern)
 */
export function translocoInitializer() {
  const transloco = inject(TranslocoService);
  const languageService = inject(LanguageService);

  const savedLanguage = localStorage.getItem('language') || 'en';
  const lang = savedLanguage === 'en' || savedLanguage === 'ar' ? savedLanguage : 'en';

  // Set active language in Transloco
  transloco.setActiveLang(lang);

  // Initialize language service (this will update HTML attributes)
  languageService.setLanguage(lang as 'en' | 'ar', false);

  // Return promise to ensure translations are loaded
  return firstValueFrom(transloco.selectTranslate('app.title'));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    // Transloco Configuration
    // Why provideTransloco: Main translation provider
    // - defaultLang: Fallback language if translation missing
    // - fallbackLang: Language to use when active lang translation missing
    // - loader: Class to load translation files (enables lazy loading)
    // - availableLangs: List of supported languages
    provideTransloco({
      config: {
        availableLangs: ['en', 'ar'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true, // Re-render components when language changes
        missingHandler: {
          // Log missing translations in development
          logMissingKey: true,
          useFallbackTranslation: true, // Use fallback language if key missing
        },
        // Production optimizations
        prodMode: false, // Set to true in production for better performance
      },
      loader: HttpLoader,
    }),

    // Transloco Locale Configuration
    // Provides locale-specific formatting (dates, numbers, etc.)
    provideTranslocoLocale({
      langToLocaleMapping: {
        en: 'en-US',
        ar: 'ar-SA',
      },
    }),

    // Initialize Transloco before app starts
    // This ensures translations are ready when components render
    // Using provideAppInitializer (Angular 21+) instead of deprecated APP_INITIALIZER
    provideAppInitializer(translocoInitializer),

    providePrimeNG({
      theme: {
        preset: aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'false',
          cssLayer: false,
          overlayAppendTo: 'body',
        },
      },
    }),
  ],
};
