import { Component, OnInit } from '@angular/core';
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
export class UserListComponent implements OnInit {
  // users: UserInfo[] = [];
  // pagination: Pagination | undefined;
  user: User | undefined;
  // bonk: any;

  // slider
  sliderMinValue: number = this.memberService.userParams().minimalAge;
  sliderMaxValue: number = this.memberService.userParams().maximalAge;
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
  // select
  orderBy: number = 0;

  constructor(
    public memberService: MembersService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    this.loadMembers();
    this.orderBy = this.memberService.userParams().orderBy;
  }

  loadMembers() {
    this.memberService.getMembers();

    // console.log(this.memberService.paginatedResult()?.pagination);
  }

  changePage(pageNumber: number) {
    this.memberService.userParams().pageNumber = pageNumber;
    this.sliderMinValue = this.memberService.userParams().minimalAge;
    this.sliderMaxValue = this.memberService.userParams().maximalAge;

    this.loadMembers();
  }
  resetFilters() {
    this.memberService.resetUserParams();
    this.sliderMinValue = 0;
    this.sliderMaxValue = 100;
    this.orderBy = 0;
    this.loadMembers();
  }
  loadParams() {
    this.memberService.userParams().minimalAge = this.sliderMinValue;
    this.memberService.userParams().maximalAge = this.sliderMaxValue;
    this.memberService.userParams().pageNumber = 1;
    this.memberService.userParams().orderBy = this.orderBy;
    this.loadMembers();
  }
}
