import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { EnvioCorreo } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CorreosService {
  private api = inject(ApiService);

  getCorreos(): Observable<EnvioCorreo[]> {
    return this.api.get<{success: boolean, data: EnvioCorreo[]}>(`email-sends`).pipe(
      map(res => res.data)
    );
  }

  enviarCorreos(envioData: any): Observable<any> {
    return this.api.post<{success: boolean, message: string, data: any}>(`email-sends/enviar`, envioData).pipe(
      map(res => res.data)
    );
  }
}
