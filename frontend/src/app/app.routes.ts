import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { formChangesGuardGuard } from './_guards/form-changes-guard.guard';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { PostAddComponent } from './posts/post-add/post-add.component';
import { UserMessagesComponent } from './users/user-messages/user-messages.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './_guards/admin.guard';
import { ApprovePostComponent } from './admin/approve-post/approve-post.component';
import { ConfiirmEmailComponent } from './email/confiirm-email/confiirm-email.component';
import { EmailConfirmedComponent } from './email/email-confirmed/email-confirmed.component';
import { SendMailComponent } from './password/send-mail/send-mail.component';
import { ResetPasswordComponent } from './password/reset-password/reset-password.component';
import { PasswordChangedComponent } from './password/password-changed/password-changed.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'email/confirm', component: ConfiirmEmailComponent },
  { path: 'email/confirmed', component: EmailConfirmedComponent },
  { path: 'password/send-mail', component: SendMailComponent },
  { path: 'password/reset', component: ResetPasswordComponent },
  { path: 'password/changed', component: PasswordChangedComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UserListComponent },
      { path: 'users/:username', component: UserDetailComponent },
      {
        path: 'user/edit',
        component: UserEditComponent,
        canDeactivate: [formChangesGuardGuard],
      },
      { path: 'user', component: UserDetailComponent },
      { path: 'follows', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'messages/:id', component: UserMessagesComponent },
      { path: 'posts/add', component: PostAddComponent },
      { path: 'posts/:id', component: PostDetailComponent },
      {
        path: 'posts/edit/:id',
        component: PostEditComponent,
      },
      {
        path: 'admin',
        component: AdminPanelComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'admin/posts/:id',
        component: ApprovePostComponent,
        canActivate: [adminGuard],
      },
    ],
  },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'errors', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];
