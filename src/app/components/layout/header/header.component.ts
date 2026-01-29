import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="top-header">
      <!-- Search -->
      <div class="header-search">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          class="search-input" 
          [placeholder]="i18n.t('header.search')"
          [(ngModel)]="searchQuery"
        >
      </div>

      <!-- Actions -->
      <div class="header-actions">
        <!-- Language Toggle -->
        <div class="language-toggle">
          <button 
            class="action-btn"
            [class.active]="i18n.language() === 'fr'"
            (click)="i18n.setLanguage('fr')"
            title="Français"
          >
            FR
          </button>
          <button 
            class="action-btn"
            [class.active]="i18n.language() === 'es'"
            (click)="i18n.setLanguage('es')"
            title="Español"
          >
            ES
          </button>
        </div>

        <!-- Theme Toggle -->
        <button 
          class="action-btn theme-btn" 
          (click)="themeService.toggleTheme()"
          [title]="i18n.t('header.theme')"
        >
          {{ themeService.isDark() ? '☀️' : '🌙' }}
        </button>

        <!-- Notifications -->
        <button class="action-btn notifications-btn" [title]="i18n.t('header.notifications')">
          <span class="notification-icon">🔔</span>
          <span class="notification-badge">3</span>
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
      justify-content: space-between;
      padding: 0 var(--spacing-lg);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-search {
      display: flex;
      align-items: center;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 8px 12px;
      width: 300px;
      transition: border-color var(--transition-fast);

      &:focus-within {
        border-color: var(--primary-color);
      }
    }

    .search-icon {
      margin-right: var(--spacing-sm);
      font-size: 14px;
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-size: 14px;
      outline: none;

      &::placeholder {
        color: var(--text-muted);
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .language-toggle {
      display: flex;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      overflow: hidden;
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

    .theme-btn, .notifications-btn {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      width: 40px;
      height: 40px;
    }

    .notifications-btn {
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #dc3545;
      color: white;
      font-size: 10px;
      font-weight: 600;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
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
  
  searchQuery = '';
  isUserMenuOpen = false;

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
