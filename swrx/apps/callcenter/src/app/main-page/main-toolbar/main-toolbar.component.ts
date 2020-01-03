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

@Component({
  selector: 'swrx-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent implements OnInit {
  @Input() title = 'SIIPAPX CALLCENTER';

  @Output() toogle = new EventEmitter();

  @Input() cartItems = 0;
  @Input() currentPedidoId;

  constructor(
    private productosUi: ProductosUiService,
    private router: Router
  ) {}

  ngOnInit() {}

  showProductos() {
    this.productosUi.openSelector();
  }
  goToCart() {
    const path = ['/shop/cart'];
    if (this.currentPedidoId) {
      path.push(this.currentPedidoId);
    }
    this.router.navigate(path);
  }
}
