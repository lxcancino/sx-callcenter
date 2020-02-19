import { TestBed } from '@angular/core/testing';

import { RastreoService } from './rastreo.service';

describe('RastreoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RastreoService = TestBed.get(RastreoService);
    expect(service).toBeTruthy();
  });
});
