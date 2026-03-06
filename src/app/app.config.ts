import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';

import { routes } from './app.routes';
import { APP_ICONS } from './icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(APP_ICONS) },
  ],
};
