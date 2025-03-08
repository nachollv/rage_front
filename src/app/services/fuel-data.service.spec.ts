import { TestBed } from '@angular/core/testing';

import { FuelDataService } from './fuel-data.service';

describe('FuelDataService', () => {
  let service: FuelDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuelDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
