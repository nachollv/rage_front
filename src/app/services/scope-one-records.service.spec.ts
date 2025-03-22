import { TestBed } from '@angular/core/testing';

import { ScopeOneRecordsService } from './scope-one-records.service';

describe('ScopeOneRecordsService', () => {
  let service: ScopeOneRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScopeOneRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
