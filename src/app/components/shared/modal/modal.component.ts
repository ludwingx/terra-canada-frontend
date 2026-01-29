import { Component, EventEmitter, Input, Output, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div class="modal-container" [class]="sizeClass" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="modal-header">
            <h2>{{ title }}</h2>
            <button class="modal-close" (click)="close()" type="button">×</button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter) {
            <div class="modal-footer">
              <button 
                class="btn btn-secondary" 
                (click)="close()" 
                type="button"
                [disabled]="loading"
              >
                {{ i18n.t('actions.cancel') }}
              </button>
              <button 
                class="btn btn-primary" 
                (click)="onSave()" 
                type="button"
                [disabled]="loading || !canSave"
              >
                @if (loading) {
                  <span class="spinner"></span>
                }
                {{ saveButtonText || i18n.t('actions.save') }}
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-container {
      background: var(--bg-card);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-xl);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.2s ease;
      width: 100%;
      margin: 0 var(--spacing-md);
    }

    @keyframes slideIn {
      from { 
        opacity: 0;
        transform: translateY(-20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-sm { max-width: 400px; }
    .modal-md { max-width: 560px; }
    .modal-lg { max-width: 720px; }
    .modal-xl { max-width: 960px; }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
      }
    }

    .modal-close {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      font-size: 24px;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
      }
    }

    .modal-body {
      padding: var(--spacing-lg);
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      border-top: 1px solid var(--border-color);
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: var(--spacing-xs);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ModalComponent {
  private platformId = inject(PLATFORM_ID);
  i18n = inject(I18nService);

  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showFooter = true;
  @Input() loading = false;
  @Input() canSave = true;
  @Input() saveButtonText?: string;
  @Input() closeOnOverlay = true;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  get sizeClass(): string {
    return `modal-${this.size}`;
  }

  onOverlayClick(event: Event): void {
    if (this.closeOnOverlay) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  onSave(): void {
    this.saved.emit();
  }
}
