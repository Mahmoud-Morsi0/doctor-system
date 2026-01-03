import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { form, Field, required, email, minLength } from '@angular/forms/signals';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
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
 * - Error handling and loading states
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
  private readonly t = inject(TranslocoService);
  protected readonly languageService: LanguageService = inject(LanguageService);

  // Loading state for form submission
  protected readonly isLoading = signal(false);

  // Error message signal
  protected readonly errorMessage = signal<string | null>(null);

  // Computed direction for RTL/LTR support
  protected readonly direction = computed(() =>
    this.languageService.isRTL() ? 'rtl' : 'ltr'
  );

  // Form model signal for Angular 21 Signal Forms
  protected readonly loginModel = signal({
    email: '',
    password: '',
  });

  // Signal form with validation
  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email format' });
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' });
  });

  // Computed signal for form validity
  protected readonly isFormValid = computed(() => this.loginForm().valid());

  // Computed signal to check if form has been touched
  protected readonly isFormTouched = computed(() => this.loginForm().touched());

  /**
   * Get field error message
   */
  getFieldError(fieldName: 'email' | 'password'): string | null {
    const formState = this.loginForm();
    // Access field state through the form's field tree structure
    const fieldState = (formState as any)[fieldName] as { touched: () => boolean; errors: () => Record<string, any> | null } | undefined;

    if (fieldState && fieldState.touched() && fieldState.errors()) {
      const errors = fieldState.errors();
      if (errors) {
        // Return first error message
        const errorValues = Object.values(errors);
        return errorValues.length > 0 ? (errorValues[0] as string) : null;
      }
    }
    return null;
  }

  /**
   * Handle form submission with async authentication
   */
  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    // Mark all fields as touched to show errors
    const formState = this.loginForm();

    if (!formState.valid()) {
      console.error('Form validation failed', formState.errors());
      this.errorMessage.set(this.t.translate('login.validationError'));
      return;
    }

    // Clear previous error
    this.errorMessage.set(null);
    this.isLoading.set(true);

    try {
      const formValue = this.loginModel();
      console.log('Login attempt:', { email: formValue.email });

      // Simulate API call
      await this.simulateAuthentication(formValue.email, formValue.password);

      // Navigate to dashboard on success
      await this.router.navigate(['/dashboard']);

    } catch (error) {
      console.error('Authentication error:', error);
      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : this.t.translate('login.unexpectedError')
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Simulate authentication (replace with actual service)
   */
  private async simulateAuthentication(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate authentication logic
        if (email && password) {
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1500);
    });
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage.set(null);
  }
}
