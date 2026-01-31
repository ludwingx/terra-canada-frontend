import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ApiService } from './api.service';
import { Rol } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private api = inject(ApiService);
  private roles$?: Observable<Rol[]>;

  getRoles(): Observable<Rol[]> {
    if (this.roles$) {
      return this.roles$;
    }

    this.roles$ = this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`roles`).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return Array.isArray(rawData) ? rawData : [];
      }),
      shareReplay(1)
    );

    return this.roles$;
  }
}
