import { TestBed } from '@angular/core/testing';

import { ProductosUiService } from './productos-ui.service';

describe('ProductosUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductosUiService = TestBed.get(ProductosUiService);
    expect(service).toBeTruthy();
  });
});
