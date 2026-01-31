import { inject, PLATFORM_ID } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

function isDebugEnabled(): boolean {
  const w = globalThis as any;
  return Boolean(w?.__env?.DEBUG_API);
}

function redactHeaders(headers: Record<string, string>): Record<string, string> {
  const copy: Record<string, string> = { ...headers };
  if (copy['Authorization']) {
    copy['Authorization'] = 'Bearer <redacted>';
  }
  if (copy['authorization']) {
    copy['authorization'] = 'Bearer <redacted>';
  }
  return copy;
}

function headersToObject(req: HttpRequest<any>): Record<string, string> {
  const obj: Record<string, string> = {};
  req.headers.keys().forEach(k => {
    const v = req.headers.get(k);
    if (v != null) obj[k] = v;
  });
  return obj;
}

export const apiDebugInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId) || !isDebugEnabled()) {
    return next(req);
  }

  // Only log API calls (avoid noise from assets)
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  const startedAt = performance.now();

  // Log request
  try {
    // eslint-disable-next-line no-console
    console.groupCollapsed(`[API] ${req.method} ${req.url}`);
    // eslint-disable-next-line no-console
    console.log('Request headers:', redactHeaders(headersToObject(req)));
    // eslint-disable-next-line no-console
    console.log('Request params:', req.params?.toString?.() || '');
    // eslint-disable-next-line no-console
    console.log('Request body:', req.body ?? null);
    // eslint-disable-next-line no-console
    console.groupEnd();
  } catch {
    // ignore logging failures
  }

  return next(req).pipe(
    tap({
      next: (event) => {
        if (!(event instanceof HttpResponse)) return;
        const ms = Math.round(performance.now() - startedAt);
        try {
          // eslint-disable-next-line no-console
          console.groupCollapsed(`[API] ${req.method} ${req.url} -> ${event.status} (${ms}ms)`);
          // eslint-disable-next-line no-console
          console.log('Response headers:', redactHeaders(event.headers?.keys?.().reduce((acc: any, k: string) => {
            acc[k] = event.headers.get(k);
            return acc;
          }, {} as Record<string, string>) || {}));
          // eslint-disable-next-line no-console
          console.log('Response body:', event.body ?? null);
          // eslint-disable-next-line no-console
          console.groupEnd();
        } catch {
          // ignore logging failures
        }
      },
      error: (err: unknown) => {
        const ms = Math.round(performance.now() - startedAt);
        try {
          // eslint-disable-next-line no-console
          console.groupCollapsed(`[API] ${req.method} ${req.url} -> ERROR (${ms}ms)`);
          // eslint-disable-next-line no-console
          console.log('Request headers:', redactHeaders(headersToObject(req)));
          // eslint-disable-next-line no-console
          console.log('Request body:', req.body ?? null);

          if (err instanceof HttpErrorResponse) {
            // eslint-disable-next-line no-console
            console.log('Status:', err.status);
            // eslint-disable-next-line no-console
            console.log('Error body:', err.error ?? null);
          } else {
            // eslint-disable-next-line no-console
            console.log('Error:', err);
          }
          // eslint-disable-next-line no-console
          console.groupEnd();
        } catch {
          // ignore logging failures
        }
      }
    })
  );
};
