import { TestBed } from '@angular/core/testing';

import { RegistroemisionesfugasService } from './registroemisionesfugas.service';

describe('RegistroemisionesfugasService', () => {
  let service: RegistroemisionesfugasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroemisionesfugasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
