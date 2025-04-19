import { TestBed } from '@angular/core/testing';

import { AuxHelpingTextsService } from './aux-helping-texts.service';

describe('EnvironmentalAuditsService', () => {
  let service: AuxHelpingTextsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuxHelpingTextsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
