import { Component } from '@angular/core';
import { Observable } from 'rxjs';
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
  isBusy$: Observable<boolean>;

  constructor(private busyService: BusyService) {
    this.isBusy$ = this.busyService.isBusy();
  }
}
