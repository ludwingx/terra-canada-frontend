import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() notifications: Notification[] = [];
  @Output() notificationDismissed = new EventEmitter<string>();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Auto-dismiss notifications con duración
    this.notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          this.dismiss(notification.id);
        }, notification.duration);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dismiss(id: string): void {
    this.notificationDismissed.emit(id);
  }

  getIconClass(type: NotificationType): string {
    const iconMap = {
      success: 'pi pi-check-circle',
      error: 'pi pi-exclamation-circle',
      warning: 'pi pi-exclamation-triangle',
      info: 'pi pi-info-circle'
    };
    return iconMap[type];
  }
}
