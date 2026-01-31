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

  // If already has Authorization, keep it
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
