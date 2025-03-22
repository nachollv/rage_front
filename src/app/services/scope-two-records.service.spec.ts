import { TestBed } from '@angular/core/testing';

import { ScopeTwoRecordsService } from './scope-two-records.service';

describe('ScopeTwoRecordsService', () => {
  let service: ScopeTwoRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScopeTwoRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
