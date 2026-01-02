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
      class="fixed left-0 top-0 z-1000 flex h-screen flex-col bg-slate-800 border-r border-slate-300 transition-[width] duration-200 ease-in-out"
      [style.width]="sidebarService.isCollapsed() ? '80px' : 'clamp(250px, 30vw, 350px)'"
      [class.collapsed]="sidebarService.isCollapsed()"
      [class.rtl]="languageService.isRTL()"
      [class.right-0]="languageService.isRTL()"
      [class.left-auto]="languageService.isRTL()"
      [class.border-l]="languageService.isRTL()"
      [class.border-r-0]="languageService.isRTL()"
    >
      <!-- Logo/Header -->
      <div class="relative flex h-[70px] items-center gap-2 border-b border-white/10 px-4 py-4 collapsed:justify-center collapsed:px-4">
        <div class="flex flex-1 items-center gap-4 min-w-0 collapsed:flex-none collapsed:w-full collapsed:justify-center">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-xl font-bold text-white">
            B
          </div>
          <span
            class="text-xl font-semibold text-white whitespace-nowrap overflow-hidden transition-[opacity,width] duration-200 ease-in-out"
            [class.w-0]="sidebarService.isCollapsed()"
            [class.opacity-0]="sidebarService.isCollapsed()"
            *transloco="let t"
          >
            {{ t('app.title') }}
          </span>
        </div>
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/10 text-slate-300 transition-all duration-200 hover:bg-white/15 hover:text-white collapsed:absolute collapsed:top-4 collapsed:right-2 rtl:collapsed:right-auto rtl:collapsed:left-2"
          (click)="toggleSidebar()"
          [attr.aria-label]="sidebarService.isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.title]="sidebarService.isCollapsed() ? 'Expand' : 'Collapse'"
        >
          <span
            class="inline-block text-base transition-transform duration-200"
            [class.rotate-180]="(!languageService.isRTL() && sidebarService.isCollapsed()) || (languageService.isRTL() && !sidebarService.isCollapsed())"
          >
            {{ sidebarService.isCollapsed() ? '→' : '←' }}
          </span>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
        <ul class="m-0 list-none p-0">
          <li *ngFor="let item of menuItems" class="m-0">
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-white/10 font-semibold text-white before:w-0.5"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
              [class.justify-center]="sidebarService.isCollapsed()"
              [class.px-4]="sidebarService.isCollapsed()"
              class="relative flex h-12 items-center gap-4 px-4 py-4 text-slate-300 no-underline transition-all duration-200 hover:bg-white/5 hover:text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0 before:bg-blue-600 before:transition-all before:duration-200 rtl:before:left-auto rtl:before:right-0"
              [title]="item.label"
            >
              <span class="flex h-6 w-6 shrink-0 items-center justify-center text-xl">{{ item.icon }}</span>
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
      icon: '📊',
      route: '/dashboard',
      translationKey: 'menu.dashboard'
    },
    {
      label: 'Reservations',
      icon: '📅',
      route: '/reservations',
      translationKey: 'menu.reservations'
    },
    {
      label: 'Patients',
      icon: '👥',
      route: '/patients',
      translationKey: 'menu.patients'
    },
    {
      label: 'Employees',
      icon: '👤',
      route: '/employees',
      translationKey: 'menu.employees'
    }
  ];
}

