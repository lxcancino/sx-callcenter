import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidoFormComponent } from './pedido-form.component';

describe('PedidoFormComponent', () => {
  let component: PedidoFormComponent;
  let fixture: ComponentFixture<PedidoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
