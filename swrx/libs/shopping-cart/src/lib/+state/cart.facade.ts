import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromCart from './cart.reducer';
import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';
import { TipoDePedido, FormaDePago } from '@swrx/core-model';
import { CartItem } from './cart.models';

@Injectable()
export class CartFacade {
  loading$ = this.store.pipe(select(CartSelectors.getCartLoading));
  cartItems$ = this.store.pipe(select(CartSelectors.getCartItems));
  sumary$ = this.store.pipe(select(CartSelectors.getCartSumary));
  cartItemsCount$ = this.store.pipe(select(CartSelectors.getCartItemsCount));
  cliente$ = this.store.pipe(select(CartSelectors.getCliente));
  descuentoPorVolumenImporte$ = this.store.pipe(
    select(CartSelectors.getDescuentoPorVolumenImporte)
  );
  descuentoPorVolumen$ = this.store.pipe(
    select(CartSelectors.getDescuentoPorVolumen)
  );
  descuento$ = this.store.pipe(select(CartSelectors.getDescuento));
  cartStateForm$ = this.store.pipe(select(CartSelectors.selectFormState));
  currentPedido = this.store.pipe(select(CartSelectors.selectCurrentPedido));
  constructor(private store: Store<fromCart.CartState>) {
    this.store.pipe(select(CartSelectors.getCartSumary));
  }

  addCartItem() {
    this.store.dispatch(CartActions.addCartItem());
  }
  editItem(item: CartItem) {
    this.store.dispatch(CartActions.editItem({ item }));
  }
  deleteItem(item: Partial<CartItem>) {
    this.store.dispatch(CartActions.deleteItem({ item }));
  }

  cambiarCliente() {
    this.store.dispatch(CartActions.cambiarCliente());
  }
  startCheckout() {
    this.store.dispatch(CartActions.startCheckout());
  }

  cambiarTipo(tipo: TipoDePedido) {
    this.store.dispatch(CartActions.cambiarTipo({ tipo }));
  }
  cambiarUso(clave: string) {
    this.store.dispatch(CartActions.cambiarUsoDeCfdi({ clave }));
  }

  cambiarFormaDePago(formaDePago: FormaDePago) {
    this.store.dispatch(CartActions.cambiarFormaDePago({ formaDePago }));
  }
}
