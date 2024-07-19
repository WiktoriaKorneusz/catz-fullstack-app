import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private busyRequestCount = 0;
  private busySubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  busy() {
    this.busyRequestCount += 1;
    this.updateBusySubject();
  }

  idle() {
    this.busyRequestCount -= 1;
    if (this.busyRequestCount <= 0) {
      this.reset();
    }
  }

  isBusy(): Observable<boolean> {
    return this.busySubject.asObservable();
  }

  private reset() {
    this.busyRequestCount = 0;
    this.updateBusySubject();
  }

  private updateBusySubject() {
    this.busySubject.next(this.busyRequestCount > 0);
  }
}
