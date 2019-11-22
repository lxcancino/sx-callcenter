import { TestBed } from '@angular/core/testing';

import { ClienteUiService } from './cliente-ui.service';

describe('ClienteUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClienteUiService = TestBed.get(ClienteUiService);
    expect(service).toBeTruthy();
  });
});
