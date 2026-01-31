import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardKPIs, MenuItem } from '../models/interfaces';

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

  getMenuItems(): Observable<MenuItem[]> {
    return new Observable(observer => {
      observer.next([
        {
          id: 'dashboard',
          label: 'Dashboard',
          translationKey: 'dashboard',
          icon: 'pi pi-home',
          route: '/dashboard'
        },
        {
          id: 'pagos',
          label: 'Pagos',
          translationKey: 'pagos',
          icon: 'pi pi-dollar',
          route: '/pagos'
        },
        {
           id: 'clientes',
           label: 'Clientes',
           translationKey: 'clientes',
           icon: 'pi pi-users',
           route: '/clientes'
        },
        {
           id: 'proveedores',
           label: 'Proveedores',
           translationKey: 'proveedores',
           icon: 'pi pi-truck',
           route: '/proveedores'
        },
        {
           id: 'tarjetas',
           label: 'Tarjetas',
           translationKey: 'financierosTarjetas',
           icon: 'pi pi-credit-card',
           route: '/financieros/tarjetas'
        },
        {
           id: 'cuentas',
           label: 'Cuentas',
           translationKey: 'cuentas',
           icon: 'pi pi-building',
           route: '/cuentas'
        },
        {
          id: 'documentos',
          label: 'Documentos',
          translationKey: 'documentos',
          icon: 'pi pi-file',
          route: '/documentos'
        },
        {
          id: 'correos',
          label: 'Correos',
          translationKey: 'correos',
          icon: 'pi pi-envelope',
          route: '/correos'
        },
        {
          id: 'auditoria',
          label: 'Auditoría',
          translationKey: 'auditoria',
          icon: 'pi pi-history',
          route: '/auditoria'
        },
        {
          id: 'usuarios',
          label: 'Usuarios',
          translationKey: 'usuarios',
          icon: 'pi pi-user-edit',
          route: '/usuarios'
        }
      ]);
      observer.complete();
    });
  }

  getReportePagos(filters?: any): Observable<any[]> {
    return this.api.get<{success: boolean, data: any[]}>(`analisis/reportes/pagos`, filters).pipe(
      map(res => res.data)
    );
  }
}
