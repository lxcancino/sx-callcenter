import { async, TestBed } from '@angular/core/testing';
import { DepositosModule } from './depositos.module';

describe('DepositosModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DepositosModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DepositosModule).toBeDefined();
  });
});
