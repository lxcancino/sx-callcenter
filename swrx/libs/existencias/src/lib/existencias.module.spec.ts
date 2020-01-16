import { async, TestBed } from '@angular/core/testing';
import { ExistenciasModule } from './existencias.module';

describe('ExistenciasModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ExistenciasModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ExistenciasModule).toBeDefined();
  });
});
