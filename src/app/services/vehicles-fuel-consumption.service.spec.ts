import { TestBed } from '@angular/core/testing';

import { VehiclesFuelConsumptionService } from './vehicles-fuel-consumption.service';

describe('VehiclesFuelConsumptionService', () => {
  let service: VehiclesFuelConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclesFuelConsumptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
