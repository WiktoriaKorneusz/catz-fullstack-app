import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { basicInterceptor } from './_interceptors/basic.interceptor';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { loadingInterceptor } from './_interceptors/loading.interceptor';
// import { testInterceptor } from './_interceptors/test.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([basicInterceptor, jwtInterceptor, loadingInterceptor]),
      withFetch()
    ),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideToastr(),
  ],
};
