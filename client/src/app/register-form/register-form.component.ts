import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  model: any = {};

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  register() {
    if (this.model.password !== this.model.passwordConfirm) {
      this.cancel('passwords do not match!');
      return;
    }
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/users');
        this.toastr.success('Registered successfully');
      },
      error: (error) => {
        this.cancel(error.message);
        this.toastr.error('Unable to register');
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  cancel(message: string) {
    console.log(message);
  }
}
