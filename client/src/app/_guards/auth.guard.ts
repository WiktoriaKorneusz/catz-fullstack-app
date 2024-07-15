import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { User } from '../_models/user';

export const authGuard: CanActivateFn = (route, state) => {
  // const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const isLocalStorageAvailable = typeof localStorage !== 'undefined';

  if (isLocalStorageAvailable) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && Object.keys(user).length > 0) {
      // console.log('not null');
      // toastr.info(user.username + ' is logged in');
      // accountService.setCurrentUser(user);
      return true;
    } else {
      // console.log('null');
      // toastr.error('You have to login to access this page');
      return false;
    }
  }
  // accountService.setCurrentUser(user);
  return false;
};

// return accountService.currentUser$.pipe(
//   map((user) => {
//     console.log(user);
//     if (user) {
//       toastr.info('You are logged in');
//       return true;
//     } else {
//       toastr.error('You have to login to access this page');
//       console.log('You have to login to access this page');
//       return false;
//     }
//   })
// );
