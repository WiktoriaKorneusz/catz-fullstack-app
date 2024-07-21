import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error) => {
      toastrService.error(error.status + ': ' + error.statusText);
      switch (error.status) {
        case 404:
          router.navigateByUrl('/not-found');
          break;
        case 500:
          const navigationExtras: NavigationExtras = {
            state: { error: error.error },
          };
          router.navigateByUrl('/server-error', navigationExtras);
          break;
        default:
          console.log(error);
          break;
      }
      return throwError(() => error);
    })
  );
};
