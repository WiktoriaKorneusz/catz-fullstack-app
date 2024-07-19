import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BusyService } from '../_services/busy.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  // isBusy: boolean = false;
  // private subscription: Subscription = new Subscription();

  // constructor(private busyService: BusyService) {}

  // ngOnInit() {
  //   this.subscription.add(
  //     this.busyService.isBusy().subscribe((isBusy) => {
  //       this.isBusy = isBusy;
  //     })
  //   );
  // }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  isBusy$: Observable<boolean>;

  constructor(private busyService: BusyService) {
    this.isBusy$ = this.busyService.isBusy();
  }
}
