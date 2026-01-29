import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Rol } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private api = inject(ApiService);

  getRoles(): Observable<Rol[]> {
    return this.api.get<{success: boolean, data: Rol[]}>(`roles`).pipe(
      map(res => res.data)
    );
  }
}
