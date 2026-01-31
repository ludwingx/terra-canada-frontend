import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  constructor() {}

  success(message: string, duration: number = 3000): void {
    this.show('success', message, duration);
  }

  error(message: string, duration: number = 4000): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration: number = 3000): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration: number = 3000): void {
    this.show('info', message, duration);
  }

  private show(type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number): void {
    this.notificationSubject.next({ type, message, duration });
  }
}
