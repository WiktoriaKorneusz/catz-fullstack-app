import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from '../_forms/text-input/text-input.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TextInputComponent,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  @Output() cancelRegister = new EventEmitter();
  public accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.formInitialize();
  }

  formInitialize() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      pronouns: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      knownAs: ['', [Validators.required]],
      interests: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required, this.validateDate()]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      passwordConfirm: [
        '',
        [Validators.required, this.matchPassword('password')],
      ],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['passwordConfirm'].updateValueAndValidity();
      },
    });
  }

  matchPassword(password: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(password)?.value
        ? null
        : { isMatching: true };
    };
  }

  validateDate(): ValidatorFn {
    return (control: AbstractControl) => {
      const currentDateValue = new Date(control.value);
      const maxDate = new Date();
      const normalizedControlValue = new Date(
        currentDateValue.getFullYear(),
        currentDateValue.getMonth(),
        currentDateValue.getDate()
      );
      const normalizedMaxDate = new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        maxDate.getDate()
      );

      return normalizedControlValue < normalizedMaxDate
        ? null
        : { isInvalidDate: true };
    };
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    if (!control) return false;
    return control.invalid && control.touched;
  }

  register() {
    if (
      this.registerForm.value.password !==
      this.registerForm.value.passwordConfirm
    ) {
      this.toastr.error('passwords do not match!');
      return;
    }
    this.registerForm.value.clientUri = location.origin + '/email/confirmed';
    console.log(this.registerForm.value);

    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/email/confirm');
        this.toastr.success('Registered successfully');
      },
      error: (error) => {
        this.cancel();
        this.toastr.error('Unable to register');
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
