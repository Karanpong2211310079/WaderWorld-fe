import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataModalComponent } from './user-data-modal.component';

describe('UserDataModalComponent', () => {
  let component: UserDataModalComponent;
  let fixture: ComponentFixture<UserDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDataModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
