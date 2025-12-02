import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDataModalComponent } from './post-data-modal.component';

describe('PostDataModalComponent', () => {
  let component: PostDataModalComponent;
  let fixture: ComponentFixture<PostDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDataModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
