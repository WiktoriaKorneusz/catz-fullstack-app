import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (user === null) {
        toastr.error('You have to login to access this page');
        return false;
      }
      if (user.roles.includes('Admin') || user.roles.includes('Moderator'))
        return true;
      else {
        toastr.error('You do not have permission to access this page');
        return false;
      }
    })
  );
};
