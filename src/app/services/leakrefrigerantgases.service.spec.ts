import { TestBed } from '@angular/core/testing';

import { LeakrefrigerantgasesService } from './leakrefrigerantgases.service';

describe('LeakrefrigerantgasesService', () => {
  let service: LeakrefrigerantgasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeakrefrigerantgasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
