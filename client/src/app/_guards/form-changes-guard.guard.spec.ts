import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { formChangesGuardGuard } from './form-changes-guard.guard';

describe('formChangesGuardGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => formChangesGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
