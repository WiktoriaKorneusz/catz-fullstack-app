import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerateUsersComponent } from './moderate-users.component';

describe('ModerateUsersComponent', () => {
  let component: ModerateUsersComponent;
  let fixture: ComponentFixture<ModerateUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerateUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModerateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
