import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCard } from '../../../models/interfaces';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  @Input() stat!: StatCard;

  getTranslatedTitle(id: string): string {
    const titleMap: { [key: string]: string } = {
      'usuarios': 'dashboard.users', // Adapted keys to I18nService keys if needed, assuming keys match or I map them
      'pagos-pendientes': 'dashboard.pending_payments',
      'tarjetas': 'nav.cards',
      'eficiencia': 'dashboard.recent_activity', // Example mapping
      'pagos-estado-pagado': 'dashboard.paid',
      'pagos-verificados': 'dashboard.verified',
      'emails-espera-envio': 'dashboard.pending_emails',
      'emails-enviados': 'dashboard.sent_emails'
    };
    return titleMap[id] || 'stat.title';
  }
}
