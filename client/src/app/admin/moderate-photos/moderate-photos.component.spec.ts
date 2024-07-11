import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratePhotosComponent } from './moderate-photos.component';

describe('ModeratePhotosComponent', () => {
  let component: ModeratePhotosComponent;
  let fixture: ComponentFixture<ModeratePhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratePhotosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratePhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
