import { TestBed } from '@angular/core/testing';

import { CarbonFootprintCalculationService } from './carbon-footprint-calculation.service';

describe('CarbonFootprintCalculationService', () => {
  let service: CarbonFootprintCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonFootprintCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
