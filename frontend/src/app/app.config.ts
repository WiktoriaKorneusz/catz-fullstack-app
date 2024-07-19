import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { basicInterceptor } from './_interceptors/basic.interceptor';
import { loadingInterceptor } from './_interceptors/loading.interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([basicInterceptor, jwtInterceptor, loadingInterceptor]),
      withFetch()
    ),
    provideToastr(),
  ],
};
