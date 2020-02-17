import { TestBed, async, inject } from '@angular/core/testing';

import { NewCartGuard } from './new-cart.guard';

describe('NewCartGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewCartGuard]
    });
  });

  it('should ...', inject([NewCartGuard], (guard: NewCartGuard) => {
    expect(guard).toBeTruthy();
  }));
});
