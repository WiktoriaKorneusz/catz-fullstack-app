import { Component, HostListener, ViewChild } from '@angular/core';
import { User } from '../../_models/user';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent {
  @ViewChild('editForm') editForm: NgForm | undefined;
  //prevention from leaving site with unsaved changes in edit form
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  user: User | null = null;
  member: Member | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  ngOnInit() {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: (member) => {
        this.member = member;
        console.log(this.member);
      },
    });
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: (_) => {
        this.toastr.success('Member was updated successfully!');
        this.editForm?.reset(this.member);
      },
      error: (error) => {
        this.toastr.error(error);
      },
    });
    // console.log(this.member);
  }
}
