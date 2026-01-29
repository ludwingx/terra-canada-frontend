import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../services/i18n.service';
import { MenuItem } from '../../../models/interfaces';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed()">
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">🌎</span>
          @if (!isCollapsed()) {
            <span class="logo-text">Terra Canada</span>
          }
        </div>
        <button class="collapse-btn" (click)="toggleCollapse()">
          {{ isCollapsed() ? '→' : '←' }}
        </button>
      </div>

      <!-- User Profile -->
      <div class="user-profile">
        <div class="user-avatar">
          <span>JD</span>
        </div>
        @if (!isCollapsed()) {
          <div class="user-info">
            <span class="user-name">Jean Dupont</span>
            <span class="user-role">ADMIN</span>
          </div>
        }
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-menu">
        @for (item of menuItems; track item.id) {
          <a 
            class="menu-item"
            [routerLink]="item.route"
            routerLinkActive="active"
            [title]="isCollapsed() ? i18n.t(item.label) : ''"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            @if (!isCollapsed()) {
              <span class="menu-text">{{ i18n.t(item.label) }}</span>
            }
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <span class="menu-icon">🚪</span>
          @if (!isCollapsed()) {
            <span class="menu-text">{{ i18n.t('nav.logout') }}</span>
          }
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: width var(--transition-normal);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;

      &.collapsed {
        width: var(--sidebar-collapsed-width);
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
      min-height: 60px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .logo-icon {
      font-size: 24px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-color);
      white-space: nowrap;
    }

    .collapse-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: var(--spacing-xs);
      color: var(--text-muted);
      font-size: 14px;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--primary-color);
      }
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 11px;
      color: var(--primary-color);
      font-weight: 500;
      text-transform: uppercase;
    }

    .sidebar-menu {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-sm);
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: 12px 16px;
      border-radius: var(--border-radius);
      color: var(--text-secondary);
      text-decoration: none;
      margin-bottom: 4px;
      transition: all var(--transition-fast);
      border-left: 3px solid transparent;

      &:hover {
        background: var(--primary-lighter);
        color: var(--primary-color);
      }

      &.active {
        background: rgba(45, 122, 122, 0.15);
        color: var(--primary-color);
        border-left-color: var(--primary-color);
        font-weight: 500;
      }
    }

    .menu-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }

    .menu-text {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-footer {
      padding: var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      width: 100%;
      padding: 12px 16px;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--bg-hover);
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }
  `]
})
export class SidebarComponent {
  i18n = inject(I18nService);
  isCollapsed = signal(false);

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'nav.dashboard', labelFr: 'Tableau de bord', icon: '📊', route: '/dashboard', roles: ['ADMIN', 'SUPERVISOR', 'EQUIPO'] },
    { id: 'payments', label: 'nav.payments', labelFr: 'Paiements', icon: '💳', route: '/pagos', roles: ['ADMIN', 'SUPERVISOR', 'EQUIPO'] },
    { id: 'suppliers', label: 'nav.suppliers', labelFr: 'Fournisseurs', icon: '🏢', route: '/proveedores', roles: ['ADMIN', 'SUPERVISOR', 'EQUIPO'] },
    { id: 'clients', label: 'nav.clients', labelFr: 'Clients', icon: '🏨', route: '/clientes', roles: ['ADMIN', 'SUPERVISOR', 'EQUIPO'] },
    { id: 'cards', label: 'nav.cards', labelFr: 'Cartes de crédit', icon: '💰', route: '/tarjetas', roles: ['ADMIN', 'SUPERVISOR', 'EQUIPO'] },
    { id: 'accounts', label: 'nav.accounts', labelFr: 'Comptes bancaires', icon: '🏦', route: '/cuentas', roles: ['ADMIN', 'SUPERVISOR'] },
    { id: 'documents', label: 'nav.documents', labelFr: 'Documents', icon: '📄', route: '/documentos', roles: ['ADMIN', 'SUPERVISOR', 'EQUIPO'] },
    { id: 'emails', label: 'nav.emails', labelFr: 'Courriels', icon: '✉️', route: '/correos', roles: ['ADMIN', 'SUPERVISOR'] },
    { id: 'users', label: 'nav.users', labelFr: 'Utilisateurs', icon: '👥', route: '/usuarios', roles: ['ADMIN'] },
    { id: 'audit', label: 'nav.audit', labelFr: 'Audit', icon: '📋', route: '/auditoria', roles: ['ADMIN', 'SUPERVISOR'] },
  ];

  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }

  logout(): void {
    console.log('Logout clicked');
    // TODO: Implementar logout
  }
}
