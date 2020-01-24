import { async, TestBed } from '@angular/core/testing';
import { TransportesModule } from './transportes.module';

describe('TransportesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TransportesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TransportesModule).toBeDefined();
  });
});
