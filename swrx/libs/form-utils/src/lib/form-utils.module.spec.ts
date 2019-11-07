import { async, TestBed } from '@angular/core/testing';
import { FormUtilsModule } from './form-utils.module';

describe('FormUtilsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormUtilsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FormUtilsModule).toBeDefined();
  });
});
