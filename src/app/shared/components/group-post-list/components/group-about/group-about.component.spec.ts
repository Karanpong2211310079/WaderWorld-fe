import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAboutComponent } from './group-about.component';

describe('GroupAboutComponent', () => {
  let component: GroupAboutComponent;
  let fixture: ComponentFixture<GroupAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
