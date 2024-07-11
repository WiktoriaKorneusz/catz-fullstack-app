import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratePostsComponent } from './moderate-posts.component';

describe('ModeratePostsComponent', () => {
  let component: ModeratePostsComponent;
  let fixture: ComponentFixture<ModeratePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratePostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
