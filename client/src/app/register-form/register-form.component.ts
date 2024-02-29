import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  model: any = {};

  constructor(public accountService: AccountService) {}

  register() {
    if (this.model.password !== this.model.passwordConfirm) {
      this.cancel('passwords do not match!');
      return;
    }
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => this.cancel(error.message),
    });
  }

  logout() {
    this.accountService.logout();
  }

  cancel(message: string) {
    console.log(message);
  }
}
