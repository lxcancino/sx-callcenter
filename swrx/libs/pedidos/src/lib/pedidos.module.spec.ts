import { async, TestBed } from '@angular/core/testing';
import { PedidosModule } from './pedidos.module';

describe('PedidosModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PedidosModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PedidosModule).toBeDefined();
  });
});
