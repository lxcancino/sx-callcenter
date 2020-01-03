import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/**
 * Temporal fix this is not the right way to acces the state from a lazy loaded module
 */
// tslint:disable-next-line: nx-enforce-module-boundaries
import { CartFacade } from '@swrx/shopping-cart';

@Component({
  selector: 'swrx-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit {
  title = 'SIIPAP Rx Call Center';
  cartItmes$ = this.cartFacade.cartItemsCount$;
  currentPedidoId = undefined;

  constructor(private cartFacade: CartFacade) {}

  ngOnInit() {
    this.cartFacade.currentPedido.subscribe(p => {
      if (p) {
        this.currentPedidoId = p.id;
      }
    });
  }
}
