import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
              provideRouter(routes), 
              provideClientHydration(withEventReplay()),
              provideHttpClient(withInterceptors(
                [AuthInterceptor]
              )),
              provideHttpClient(), // Use this instead of HttpClientModule
              importProvidersFrom(BrowserModule), // If you need BrowserModule providers
            ]
};
