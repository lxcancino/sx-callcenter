import { async, TestBed } from '@angular/core/testing';
import { ProductosModule } from './productos.module';

describe('ProductosModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ProductosModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ProductosModule).toBeDefined();
  });
});
