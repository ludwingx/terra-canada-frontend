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

    this.roles$ = this.api.get<{ success?: boolean; estado?: boolean; data: Rol[] }>(`roles`).pipe(
      map(res => res.data || []),
      shareReplay(1)
    );

    return this.roles$;
  }
}
