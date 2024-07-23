import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from '../_services/account.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailService } from '../_services/email.service';
import { ToastrService } from 'ngx-toastr';
import { ContactForm } from '../_models/contactForm';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  accountService = inject(AccountService);
  private emailService = inject(EmailService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  contactForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
    });
  }

  sendMail() {
    if (
      !this.contactForm.valid ||
      this.contactForm.value.fullName.trim() === '' ||
      this.contactForm.value.email.trim() === '' ||
      this.contactForm.value.message.trim() === ''
    ) {
      this.toastr.error('Contact form is not valid');
      return;
    }
    const formValue: ContactForm = {
      fullName: this.contactForm.value.fullName.trim(),
      email: this.contactForm.value.email.trim(),
      message: this.contactForm.value.message.trim(),
    };
    this.emailService.sendContactMessage(formValue).subscribe({
      next: () => {
        this.contactForm.reset();
        this.toastr.success('your message was sent successfully');
      },
    });
  }
}
