import { TestBed } from '@angular/core/testing';

import { RanquingCalculationService } from './ranquing-calculation.service';

describe('CarbonFootprintCalculationService', () => {
  let service: RanquingCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RanquingCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
