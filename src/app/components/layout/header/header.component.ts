import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../services/i18n.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="top-header">
      <!-- Actions -->
      <div class="header-actions">
        <!-- Language Selector -->
        <div class="lang-menu">
          <button class="lang-btn" (click)="toggleLangMenu()" type="button">
            <span class="flag">
              @if (i18n.language() === 'fr') {
                <svg class="flag-icon" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
                  <rect width="1" height="2" x="0" y="0" fill="#0055A4"></rect>
                  <rect width="1" height="2" x="1" y="0" fill="#FFFFFF"></rect>
                  <rect width="1" height="2" x="2" y="0" fill="#EF4135"></rect>
                </svg>
              } @else {
                <svg class="flag-icon" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
                  <rect width="3" height="2" x="0" y="0" fill="#AA151B"></rect>
                  <rect width="3" height="1" x="0" y="0.5" fill="#F1BF00"></rect>
                </svg>
              }
            </span>
            <span class="lang-code">{{ i18n.language() === 'fr' ? 'FR' : 'ES' }}</span>
            <span class="dropdown-arrow">▼</span>
          </button>

          @if (isLangMenuOpen) {
            <div class="lang-dropdown">
              <button class="dropdown-item" type="button" (click)="setLanguage('fr')">
                <span class="flag">
                  <svg class="flag-icon" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
                    <rect width="1" height="2" x="0" y="0" fill="#0055A4"></rect>
                    <rect width="1" height="2" x="1" y="0" fill="#FFFFFF"></rect>
                    <rect width="1" height="2" x="2" y="0" fill="#EF4135"></rect>
                  </svg>
                </span>
                Français
              </button>
              <button class="dropdown-item" type="button" (click)="setLanguage('es')">
                <span class="flag">
                  <svg class="flag-icon" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
                    <rect width="3" height="2" x="0" y="0" fill="#AA151B"></rect>
                    <rect width="3" height="1" x="0" y="0.5" fill="#F1BF00"></rect>
                  </svg>
                </span>
                Español
              </button>
            </div>
          }
        </div>

        <!-- Theme Toggle -->
        <button 
          class="action-btn theme-btn" 
          (click)="themeService.toggleTheme()"
          [title]="i18n.t('header.theme')"
        >
          {{ themeService.isDark() ? '☀️' : '🌙' }}
        </button>

        <!-- User Menu -->
        <div class="user-menu">
          <button class="user-btn" (click)="toggleUserMenu()">
            <span class="user-avatar-sm">JD</span>
            <span class="user-name-sm">Jean Dupont</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          
          @if (isUserMenuOpen) {
            <div class="user-dropdown">
              <a class="dropdown-item" href="#">
                <span>👤</span>
                {{ i18n.t('header.profile') }}
              </a>
              <a class="dropdown-item" href="#">
                <span>⚙️</span>
                {{ i18n.t('nav.settings') }}
              </a>
              <hr class="dropdown-divider">
              <a class="dropdown-item" href="#">
                <span>🚪</span>
                {{ i18n.t('nav.logout') }}
              </a>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .top-header {
      height: var(--header-height);
      background: var(--bg-header);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 var(--spacing-lg);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .lang-menu {
      position: relative;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 6px 10px;
      height: 40px;
      min-width: 88px;
      cursor: pointer;
      transition: all var(--transition-fast);

      color: var(--text-primary);

      &:hover {
        border-color: var(--primary-color);
      }
    }

    .flag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .flag-icon {
      width: 18px;
      height: 12px;
      border-radius: 2px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
      display: block;
    }

    .lang-code {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: 0.03em;
    }

    .lang-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      min-width: 160px;
      z-index: 100;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .lang-dropdown .dropdown-item {
      width: 100%;
      border: none;
      background: transparent;
      cursor: pointer;
      text-align: left;
    }

    .lang-dropdown .dropdown-item span {
      display: inline-flex;
      margin-right: 10px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 14px;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--bg-hover);
        color: var(--primary-color);
      }

      &.active {
        background: var(--primary-color);
        color: white;
      }
    }

    .theme-btn {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      width: 40px;
      height: 40px;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 6px 12px;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--primary-color);
      }
    }

    .user-avatar-sm {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
    }

    .user-name-sm {
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 500;
    }

    .dropdown-arrow {
      font-size: 10px;
      color: var(--text-muted);
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      min-width: 180px;
      z-index: 100;
      overflow: hidden;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: 10px 16px;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 14px;
      transition: background var(--transition-fast);

      &:hover {
        background: var(--bg-hover);
        color: var(--primary-color);
      }
    }

    .dropdown-divider {
      border: none;
      border-top: 1px solid var(--border-color);
      margin: 4px 0;
    }
  `]
})
export class HeaderComponent {
  i18n = inject(I18nService);
  themeService = inject(ThemeService);
  
  isLangMenuOpen = false;
  isUserMenuOpen = false;

  toggleLangMenu(): void {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  setLanguage(lang: 'fr' | 'es'): void {
    this.i18n.setLanguage(lang);
    this.isLangMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
