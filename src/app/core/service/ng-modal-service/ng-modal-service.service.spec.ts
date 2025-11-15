import { TestBed } from '@angular/core/testing';

import { NgModalServiceService } from './ng-modal-service.service';

describe('NgModalServiceService', () => {
  let service: NgModalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgModalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
