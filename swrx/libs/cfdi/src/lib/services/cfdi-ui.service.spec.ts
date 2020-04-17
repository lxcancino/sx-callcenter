import { TestBed } from '@angular/core/testing';

import { CfdiUiService } from './cfdi-ui.service';

describe('CfdiUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CfdiUiService = TestBed.get(CfdiUiService);
    expect(service).toBeTruthy();
  });
});
