import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardKPIs } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private api = inject(ApiService);

  getKPIs(): Observable<DashboardKPIs> {
    return this.api.get<{success: boolean, data: DashboardKPIs}>(`analisis/dashboard`).pipe(
      map(res => res.data)
    );
  }

  getReportePagos(filters?: any): Observable<any[]> {
    return this.api.get<{success: boolean, data: any[]}>(`analisis/reportes/pagos`, filters).pipe(
      map(res => res.data)
    );
  }
}
