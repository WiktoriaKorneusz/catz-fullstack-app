import { CanDeactivateFn } from '@angular/router';
import { UserEditComponent } from '../users/user-edit/user-edit.component';
import { PostEditComponent } from '../posts/post-edit/post-edit.component';

export const formChangesGuardGuard: CanDeactivateFn<
  UserEditComponent | PostEditComponent
> = (component, currentRoute, currentState, nextState) => {
  if (component.editForm?.dirty) {
    return confirm(
      'There are unsaved changes that will be lost. Dou you still want to continue?'
    );
  }
  return true;
};
