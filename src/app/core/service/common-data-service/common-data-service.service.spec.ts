import { TestBed } from '@angular/core/testing';

import { CommonDataServiceService } from './common-data-service.service';

describe('CommonDataServiceService', () => {
  let service: CommonDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
