import { inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Do not attach auth header for login
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  // Avoid caching API responses in browser (prevents 304/ETag serving stale data)
  let mutatedReq = req;
  if (!mutatedReq.headers.has('Cache-Control')) {
    mutatedReq = mutatedReq.clone({
      setHeaders: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    });
  }

  // If already has Authorization, keep it
  if (mutatedReq.headers.has('Authorization')) {
    return next(mutatedReq);
  }

  const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
  if (!token) {
    return next(mutatedReq);
  }

  return next(
    mutatedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
