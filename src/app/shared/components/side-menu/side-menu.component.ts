import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageService, SidebarService } from '../../../core/services';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  translationKey: string;
  children?: MenuItem[];
}

/**
 * Side Menu Component
 *
 * Global sidebar navigation component matching the design.
 * Features:
 * - Collapsible menu items
 * - Active route highlighting
 * - Icon support
 * - Responsive design
 * - RTL/LTR support
 * - Uses CSS variables for styling
 */
@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, LanguageSwitcherComponent],
  template: `
    <aside
      class="fixed left-0 top-0 z-1000 flex h-screen flex-col bg-white border-r border-primary-300 transition-[width] duration-200 ease-in-out"
      [style.width]="sidebarService.isCollapsed() ? '80px' : 'clamp(250px, 30vw, 250px)'"
      [class.collapsed]="sidebarService.isCollapsed()"
      [class.rtl]="languageService.isRTL()"
      [class.right-0]="languageService.isRTL()"
      [class.left-auto]="languageService.isRTL()"
      [class.border-l]="languageService.isRTL()"
      [class.border-r-0]="languageService.isRTL()"
    >
      <!-- Logo/Header -->
      <div class="relative flex h-[70px] items-center gap-2 border-b border-white/10 px-4 py-4 collapsed:justify-center collapsed:px-4">
        <div class="flex flex-1 items-center gap-4 min-w-0 collapsed:flex-none collapsed:w-full collapsed:justify-center collapsed:items-center">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xl font-bold text-white">
            B
          </div>
          <span
            class="text-xl font-semibold text-primary-600 whitespace-nowrap overflow-hidden transition-[opacity,width] duration-200 ease-in-out"
            [class.w-0]="sidebarService.isCollapsed()"
            [class.opacity-0]="sidebarService.isCollapsed()"
            *transloco="let t"
          >
            {{ t('app.title') }}
          </span>
        </div>
        <!-- <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-100 text-primary-600 transition-all duration-200 hover:bg-primary-200 hover:text-primary-700 collapsed:absolute collapsed:top-4 collapsed:right-2 rtl:collapsed:right-auto rtl:collapsed:left-2"
          (click)="toggleSidebar()"
          [attr.aria-label]="sidebarService.isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.title]="sidebarService.isCollapsed() ? 'Expand' : 'Collapse'"
        >
          <i
            [class]="sidebarService.isCollapsed() ? 'pi pi-angle-right' : 'pi pi-angle-left'"
            class="text-xl transition-transform duration-200 text-primary-600"
            [class.rotate-180]="(!languageService.isRTL() && sidebarService.isCollapsed()) || (languageService.isRTL() && !sidebarService.isCollapsed())"
          ></i>
        </button> -->
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
        <ul class="m-0 list-none p-0">

          @for (item of menuItems; track item.route) {
            <li class="m-0">
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-primary-100 font-semibold text-primary-600 before:w-0.5"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
              [class.justify-center]="sidebarService.isCollapsed()"
              [class.px-4]="sidebarService.isCollapsed()"
              class=" relative flex h-12 items-center gap-4 px-8 py-4 text-primary-600 no-underline transition-all duration-200 hover:bg-primary-100 hover:text-primary-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0 before:bg-primary-600 before:transition-all before:duration-200 rtl:before:left-auto rtl:before:right-0"
              [title]="item.label"
            >
              <i [class]="item.icon" class="text-xl text-primary-600"></i>
              <span
                class="text-[0.9375rem] whitespace-nowrap overflow-hidden transition-[opacity,width] duration-200 ease-in-out"
                [class.w-0]="sidebarService.isCollapsed()"
                [class.opacity-0]="sidebarService.isCollapsed()"
                *transloco="let t"
              >
                {{ t(item.translationKey) }}
              </span>
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Footer Actions -->
      <div
        class="border-t border-white/10 px-4 py-4 collapsed:flex collapsed:justify-center collapsed:px-4"
        [class.collapsed]="sidebarService.isCollapsed()"
      >
        <app-language-switcher [isCollapsed]="sidebarService.isCollapsed()"></app-language-switcher>
      </div>
    </aside>
  `
})
export class SideMenuComponent {
  protected readonly languageService = inject(LanguageService);
  protected readonly sidebarService = inject(SidebarService);

  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  /**
   * Menu items configuration
   * Add new menu items here following the same structure
   */
  protected readonly menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
      translationKey: 'menu.dashboard'
    },
    {
      label: 'Appointments',
      icon: 'pi pi-calendar',
      route: '/appointments',
      translationKey: 'menu.appointments'
    },
    {
      label: 'Reservations',
      icon: 'pi pi-calendar-clock',
      route: '/reservations',
      translationKey: 'menu.reservations'
    },
    {
      label: 'Patients',
      icon: 'pi pi-users',
      route: '/patients',
      translationKey: 'menu.patients'
    },
    {
      label: 'Employees',
      icon: 'pi pi-user',
      route: '/employees',
      translationKey: 'menu.employees'
    }
  ];
}

