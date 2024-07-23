import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPasword } from '../../_models/resetPassword';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  model: ResetPasword = {
    email: '',
    password: '',
    confirmPassword: '',
    token: '',
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.model.token = decodeURIComponent(params['token'] || null);
      this.model.email = params['email'] || null;
    });
  }

  changePassword() {
    if (this.model.password !== this.model.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }
    this.accountService.resetPassword(this.model).subscribe({
      next: () => {
        this.toastr.success('Password changed successfully');
        this.router.navigate(['/password/changed']);
      },
    });
  }
}
