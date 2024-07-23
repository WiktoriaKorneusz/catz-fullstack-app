import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-confirmed',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './email-confirmed.component.html',
  styleUrl: './email-confirmed.component.css',
})
export class EmailConfirmedComponent implements OnInit {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  email: string = '';
  emailToken: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.emailToken = encodeURIComponent(params['token'] || null);
      this.email = params['email'] || null;
    });

    this.confirmEmail(this.email, this.emailToken);
  }

  confirmEmail(email: string, token: string) {
    this.accountService.confirmEmail(email, token).subscribe({
      next: () => {
        this.toastr.success('Email confirmed successfully');
      },
    });
  }
}
