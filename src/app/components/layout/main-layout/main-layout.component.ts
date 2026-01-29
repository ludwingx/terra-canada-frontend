import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      
      <div class="main-wrapper">
        <app-header />
        
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-wrapper {
      flex: 1;
      margin-left: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left var(--transition-normal);
    }

    .main-content {
      flex: 1;
      padding: var(--spacing-lg);
      background: var(--bg-content);
      overflow-y: auto;
    }

    /* Cuando sidebar está colapsado */
    :host-context(.sidebar-collapsed) .main-wrapper {
      margin-left: var(--sidebar-collapsed-width);
    }
  `]
})
export class MainLayoutComponent {}
