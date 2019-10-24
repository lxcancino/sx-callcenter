import { async, TestBed } from '@angular/core/testing';
import { ClientesModule } from './clientes.module';

describe('ClientesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClientesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ClientesModule).toBeDefined();
  });
});
