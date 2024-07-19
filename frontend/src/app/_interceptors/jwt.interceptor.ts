import { HttpInterceptorFn } from '@angular/common/http';
import { Inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  let currentUser: User | null = null;
  const isLocalStorageAvailable = typeof localStorage !== 'undefined';

  if (isLocalStorageAvailable) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  }

  if (currentUser && currentUser.token) {
    console.log('User token:', currentUser.token);
    // Execute your code that should run when the user has a token
    // For instance, cloning the request to add an Authorization header
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
  }

  return next(req);
};
