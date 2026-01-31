import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = this.resolveBaseUrl();

  private resolveBaseUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      const w = window as any;
      const runtimeUrl = w?.__env?.API_BASE_URL;
      if (typeof runtimeUrl === 'string' && runtimeUrl.trim().length > 0) {
        return runtimeUrl.replace(/\/+$/, '');
      }
    }
    return String(environment.apiUrl || '').replace(/\/+$/, '');
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = String(endpoint || '').replace(/^\//, '');
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  private getHeaders(): HttpHeaders {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
       token = localStorage.getItem('token');
    }
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T>(this.buildUrl(endpoint), { 
      headers: this.getHeaders(),
      params: httpParams
    });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, { 
      headers: this.getHeaders() 
    });
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, { 
      headers: this.getHeaders() 
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), { 
      headers: this.getHeaders() 
    });
  }
}
