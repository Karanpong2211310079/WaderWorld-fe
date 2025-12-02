import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleGroupComponent } from './people-group.component';

describe('PeopleGroupComponent', () => {
  let component: PeopleGroupComponent;
  let fixture: ComponentFixture<PeopleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
