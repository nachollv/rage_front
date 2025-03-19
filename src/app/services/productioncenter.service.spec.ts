import { TestBed } from '@angular/core/testing';

import { ProductioncenterService } from './productioncenter.service';

describe('ProductioncenterService', () => {
  let service: ProductioncenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductioncenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
