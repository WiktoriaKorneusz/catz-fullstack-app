import { Component } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users: Member[] = [];
  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadMembers();
    // console.log(this.members);
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.users = members;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
