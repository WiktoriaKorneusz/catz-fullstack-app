import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  // const user = JSON.parse(localStorage.getItem('user') || '{}');
  // if (user && Object.keys(user).length > 0) {
  if (accountService.currentUser()) {
    return true;
  } else {
    toastr.error('you have to login to access this page');
    return false;
  }
};
