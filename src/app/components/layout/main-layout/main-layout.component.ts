import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { NotificationComponent, Notification } from '../../shared/notification/notification.component';
import { NotificationService } from '../../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    NotificationComponent
  ],
  template: `
    <div class="app-layout">
      <app-sidebar />
      
      <div class="main-wrapper">
        <app-header />
        
        <main class="main-content">
          <router-outlet />
        </main>
        
        <app-notification 
          [notifications]="notifications" 
          (notificationDismissed)="onDismiss($event)" />
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-content);
    }

    .main-wrapper {
      flex: 1;
      margin-left: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left 0.3s ease;
      width: calc(100% - var(--sidebar-width));
      position: relative; /* For notification positioning context if needed */
    }

    .main-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: var(--bg-content);
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        const id = Date.now().toString();
        this.notifications.push({ ...notification, id });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDismiss(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}
