import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // ✅ Add blocking initial navigation for SSR safety and clean fallback handling
    provideRouter(routes, withEnabledBlockingInitialNavigation()),

    provideClientHydration(withEventReplay())
  ]
};


