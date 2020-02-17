import { TestBed } from '@angular/core/testing';

import { PedidosUiService } from './pedidos-ui.service';

describe('PedidosUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PedidosUiService = TestBed.get(PedidosUiService);
    expect(service).toBeTruthy();
  });
});
