import { ApplicationConfig, provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { authInterceptor } from './interceptors/auth.interceptor';
import { apiDebugInterceptor } from './interceptors/api-debug.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, apiDebugInterceptor])),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({ 
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.dark-mode',
                cssLayer: {
                    name: 'primeng',
                    order: 'primeng, app-styles'
                }
            }
        }
    })
  ]
};
