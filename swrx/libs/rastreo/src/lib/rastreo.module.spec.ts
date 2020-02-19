import { async, TestBed } from '@angular/core/testing';
import { RastreoModule } from './rastreo.module';

describe('RastreoModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RastreoModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(RastreoModule).toBeDefined();
  });
});
