import { Component } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../_models/userInfo';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LabelType, NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';
import { PaginatedResult, Pagination } from '../../_models/pagination';
import { UserParams } from '../../_models/userParams';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent, CommonModule, NgxSliderModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  // users$: Observable<UserInfo[]> | undefined;
  // this.
  users: UserInfo[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;

  // slider
  sliderMinValue: number = 0;
  sliderMaxValue: number = 100;
  sliderOptions: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return `${value}`;
        case LabelType.High:
          return `${value}`;
        default:
          return `${value}`;
      }
    },
  };

  orderBy: number = 0;

  constructor(
    private memberService: MembersService,
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    // this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    // this.users$ = this.memberService.getMembers();
    // console.log(this.members);
    this.loadMembers();

    console.log(this.pagination);
  }

  loadMembers() {
    if (!this.userParams) {
      this.userParams = new UserParams();
    }

    this.memberService.getMembers(this.userParams).subscribe({
      next: (response) => {
        if (response.result && response.pagination) {
          this.users = response.result;
          this.pagination = response.pagination;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  changePage(pageNumber: number) {
    if (this.userParams && this.userParams?.pageNumber !== pageNumber) {
      this.userParams.pageNumber = pageNumber;
      this.sliderMinValue = this.userParams.minimalAge;
      this.sliderMaxValue = this.userParams.maximalAge;

      this.loadMembers();
    }
  }
  resetFilters() {
    console.log('bonk');
    if (this.user) {
      this.userParams = new UserParams();
      this.sliderMinValue = 0;
      this.sliderMaxValue = 100;
      this.loadMembers();
    }
  }
  loadParams() {
    if (this.userParams === undefined) return;
    this.userParams.minimalAge = this.sliderMinValue;
    this.userParams.maximalAge = this.sliderMaxValue;
    this.userParams.pageNumber = 1;
    this.userParams.orderBy = this.orderBy;
    console.log(this.userParams);
    this.loadMembers();
  }
}
