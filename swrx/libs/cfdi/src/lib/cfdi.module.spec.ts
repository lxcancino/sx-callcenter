import { async, TestBed } from '@angular/core/testing';
import { CfdiModule } from './cfdi.module';

describe('CfdiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CfdiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CfdiModule).toBeDefined();
  });
});
