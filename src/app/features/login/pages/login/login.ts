import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { form, Field, required, email } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LanguageService } from '../../../../core/services';
/**
 * Login Page Component
 *
 * Split-screen login page with:
 * - Left side: Login form with email and password
 * - Right side: Aesthetic wellness image
 * - Password visibility toggle
 * - Form validation using Angular 21 Signal Forms
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    TranslocoModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private readonly router = inject(Router);
  protected readonly languageService: LanguageService = inject(LanguageService);

  // Computed direction for RTL/LTR support
  protected readonly direction = computed(() => (this.languageService.isRTL() ? 'rtl' : 'ltr'));

  // Form model signal for Angular 21 Signal Forms
  protected readonly loginModel = signal({
    email: '',
    password: '',
  });

  // Signal form with validation
  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.password);
  });

  /**
   * Handle form submission
   */
  handleSubmit(event: Event): void {
    event.preventDefault();

    // Check form validity
    if (!this.loginForm().valid()) {
      console.error('Form validation failed');
      return;
    }

    const formValue = this.loginModel();
    console.log('Login attempt:', { email: formValue.email });

    // TODO: Implement actual authentication logic
    // For now, redirect to dashboard
    this.router.navigate(['/dashboard']);
  }
}

