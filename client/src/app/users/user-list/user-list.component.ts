import { Component } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../_models/userInfo';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users$: Observable<UserInfo[]> | undefined;
  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.users$ = this.memberService.getMembers();
    // console.log(this.members);
  }

  // loadMembers() {
  //   this.memberService.getMembers().subscribe({
  //     next: (members) => {
  //       this.users = members;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }
}
