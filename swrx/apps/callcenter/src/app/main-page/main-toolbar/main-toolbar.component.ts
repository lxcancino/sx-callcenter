import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductosUiService } from '@swrx/productos';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { ClienteUiService } from '@swrx/clientes';
import { User } from '@swrx/core-model';

@Component({
  selector: 'swrx-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent implements OnInit {
  @Input() title = 'SIIPAPX CALLCENTER';

  @Output() toogle = new EventEmitter();
  @Output() exitApp = new EventEmitter();

  @Input() cartItems = 0;
  @Input() currentPedidoId;
  @Input() user: User;

  constructor(
    private productosUi: ProductosUiService,
    private clienteUi: ClienteUiService,
    private router: Router
  ) {}

  ngOnInit() {}

  showProductos() {
    this.productosUi.openSelector();
  }

  lookupCliente() {
    this.clienteUi.lookup();
  }

  goToCart() {
    const path = ['/shop/cart'];
    if (this.currentPedidoId) {
      path.push(this.currentPedidoId);
    }
    this.router.navigate(path);
  }
}
