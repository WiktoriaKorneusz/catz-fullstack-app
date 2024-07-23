import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-mail',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './send-mail.component.html',
  styleUrl: './send-mail.component.css',
})
export class SendMailComponent {
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  email: string = '';

  sendPasswordMail() {
    if (this.email.trim() === '') {
      return;
    }
    const model = {
      email: this.email.trim(),
      clientUri: location.origin + '/password/reset',
    };
    this.accountService.forgotPassword(model).subscribe({
      next: () => {
        this.toastr.success('Please check your email to reset password');
        this.router.navigate(['/login']);
      },
    });
  }
}
