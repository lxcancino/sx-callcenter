import { async, TestBed } from '@angular/core/testing';
import { FaModule } from './fa.module';

describe('FaModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FaModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FaModule).toBeDefined();
  });
});
