import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { authGuard } from './_guards/auth.guard';
import path from 'path';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { formChangesGuardGuard } from './_guards/form-changes-guard.guard';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { PostAddComponent } from './posts/post-add/post-add.component';
import { UserDeleteComponent } from './users/user-delete/user-delete.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
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
      { path: 'user/delete', component: UserDeleteComponent },
      { path: 'user', component: UserDetailComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'posts/add', component: PostAddComponent },
      { path: 'posts/:id', component: PostDetailComponent },
      {
        path: 'posts/edit/:id',
        component: PostEditComponent,
        canDeactivate: [formChangesGuardGuard],
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
