import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { addTokenInterceptor } from './add-token.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

const bootstrap = () => {
  const auth = inject(AuthService);
  return () => {
    const token =
      localStorage.getItem('TOKEN_KEY') || sessionStorage.getItem('TOKEN_KEY');
    const user =
      localStorage.getItem('USER_KEY') || sessionStorage.getItem('USER_KEY');
    if (token) {
      auth.$token.set(token);
      auth.$user.set(JSON.parse(user!));
    }
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    // AuthService,
    HttpClient,
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: bootstrap,
    },
  ],
};
