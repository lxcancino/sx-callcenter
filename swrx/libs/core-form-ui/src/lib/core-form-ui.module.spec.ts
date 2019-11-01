import { async, TestBed } from '@angular/core/testing';
import { CoreFormUiModule } from './core-form-ui.module';

describe('CoreFormUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreFormUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CoreFormUiModule).toBeDefined();
  });
});
