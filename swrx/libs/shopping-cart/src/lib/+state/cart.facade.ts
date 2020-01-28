import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import * as fromCart from './cart.reducer';
import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';
import * as fromPedido from '@swrx/pedidos';

import { TipoDePedido, FormaDePago, Pedido, Socio } from '@swrx/core-model';
import { CartItem } from './cart.models';
import { map } from 'rxjs/operators';

import { MatDialog } from '@angular/material';
import { CartAutorizacionComponent } from '../cart-autorizacion/cart-autorizacion.component';

@Injectable()
export class CartFacade {
  loading$ = this.store.pipe(select(CartSelectors.getCartLoading));
  cartItems$ = this.store.pipe(select(CartSelectors.getCartItems));
  sumary$ = this.store.pipe(select(CartSelectors.getCartSumary));
  cartItemsCount$ = this.store.pipe(select(CartSelectors.getCartItemsCount));
  cliente$ = this.store.pipe(select(CartSelectors.getCliente));
  nombre$ = this.store.pipe(select(CartSelectors.getNombre));
  descuentoPorVolumenImporte$ = this.store.pipe(
    select(CartSelectors.getDescuentoPorVolumenImporte)
  );
  descuentoPorVolumen$ = this.store.pipe(
    select(CartSelectors.getDescuentoPorVolumen)
  );
  descuento$ = this.store.pipe(select(CartSelectors.getDescuento));
  cartStateForm$ = this.store.pipe(select(CartSelectors.selectFormState));
  currentPedido = this.store.pipe(select(CartSelectors.selectCurrentPedido));

  errors$ = this.store.pipe(select(CartSelectors.getValidationErrors));
  errorsCount$ = this.errors$.pipe(map(errors => (errors ? errors.length : 0)));
  hasErrors$ = this.store.pipe(select(CartSelectors.hasErrors));

  warnings$ = this.store.pipe(select(CartSelectors.getWarnings));
  warningsCount$ = this.store.pipe(select(CartSelectors.getWarningsCount));
  hasWarnings$ = this.store.pipe(select(CartSelectors.hasWarnings));
  isPrintable$ = this.store.pipe(select(CartSelectors.isPrintable));
  envio$ = this.store.pipe(select(CartSelectors.selectEnvio));
  dirty$ = this.store.pipe(select(CartSelectors.isDirty));
  socio$ = this.store.pipe(select(CartSelectors.selectSocio));
  descuentoEspecial$ = this.store.pipe(
    select(CartSelectors.selectDescuentoEspecial)
  );
  descuentoEspecialPosible$ = this.store.pipe(
    select(CartSelectors.selectDescuentoEspecialPosible)
  );
  autorizaciones$ = this.store.pipe(
    select(CartSelectors.selectAutorizacionesPendientes)
  );
  kilos$ = this.store.pipe(select(CartSelectors.selectKilos));
  constructor(
    private store: Store<fromCart.CartState>,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.store.pipe(select(CartSelectors.getCartSumary));
  }

  addCartItem() {
    this.store.dispatch(CartActions.addCartItem());
  }
  editItem(index: number, item: CartItem) {
    console.log('Editando partida: ', index);
    this.store.dispatch(CartActions.editItem({ item, index }));
  }
  deleteItem(item: Partial<CartItem>) {
    this.store.dispatch(CartActions.deleteItem({ item }));
  }

  cambiarCliente() {
    this.store.dispatch(CartActions.cambiarCliente());
  }
  startCheckout(user: any) {
    // const user = { displayName: 'Admin', email: 'admin@gmail.com' };
    this.store.dispatch(CartActions.startCheckout({ user }));
  }

  cambiarTipo(tipo: TipoDePedido) {
    this.store.dispatch(CartActions.cambiarTipo({ tipo }));
  }
  cambiarUso(clave: string) {
    this.store.dispatch(CartActions.cambiarUsoDeCfdi({ clave }));
  }
  cambiarMail(email: string) {
    this.store.dispatch(CartActions.cambiarCfdiMail({ email }));
  }
  cambiarSucursal(sucursal: string) {
    this.store.dispatch(CartActions.cambiarSucursal({ sucursal }));
  }

  cambiarFormaDePago(formaDePago: FormaDePago) {
    this.store.dispatch(CartActions.cambiarFormaDePago({ formaDePago }));
  }

  cambiarNombre() {
    this.store.dispatch(CartActions.cambiarNombre());
  }
  cambiarComprador(comprador: string) {
    this.store.dispatch(CartActions.cambiarComprador({ comprador }));
  }
  cambiarComentario(comentario: string) {
    this.store.dispatch(CartActions.cambiarComentario({ comentario }));
  }

  /**
   * Clean the ShoppingCartState
   */
  cleanShoppingCartState() {
    const path = ['/shop/cart'];
    this.router.navigate(path);
    this.store.dispatch(CartActions.cleanShoppingCart());
  }

  eliminarPedido(pedido: Pedido) {
    console.log('Eliminar pedido.....');
  }

  registrarEnvio() {
    this.store.dispatch(CartActions.registrarEnvio());
  }
  cancelarEnvio() {
    this.store.dispatch(CartActions.cancelarEnvio());
  }

  cerrarPedido(pedido: Pedido) {
    this.store.dispatch(CartActions.iniciarCierreDePedido({ pedido }));
  }

  mostrarDescuentos() {
    this.store.dispatch(CartActions.mostrarDescuentos());
  }

  asignarSocio(socio: Socio) {
    this.store.dispatch(CartActions.asignarSocio({ socio }));
  }

  asignarDescuentoEspecial() {
    this.store.dispatch(CartActions.assignarDescuentoEspecial());
  }

  autorizarPedido(pedido: Partial<Pedido>, user: any, tags: string) {
    this.dialog
      .open(CartAutorizacionComponent, {
        data: { pedido, tags, user },
        width: '450px'
      })
      .afterClosed()
      .subscribe(auth => {
        if (auth) {
          this.store.dispatch(
            fromPedido.autorizarPedido({ id: pedido.id, auth })
          );
        }
      });
  }

  cancelarMantenimiento() {
    this.store.dispatch(CartActions.cleanShoppingCart());
    const path = ['/pedidos'];
    this.router.navigate(path);
  }
}
