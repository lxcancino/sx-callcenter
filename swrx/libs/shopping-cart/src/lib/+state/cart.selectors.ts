import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CART_FEATURE_KEY, CartState } from './cart.reducer';
import { CartSumary, CartItem } from './cart.models';
import { Observable } from 'rxjs';

import sumBy from 'lodash/sumBy';
import round from 'lodash/round';
import maxBy from 'lodash/maxBy';
import values from 'lodash/values';
import { Pedido, TipoDePedido, FormaDePago } from '@swrx/core-model';

export const getCartState = createFeatureSelector<CartState>(CART_FEATURE_KEY);

export const getCartLoading = createSelector(
  getCartState,
  state => state.loading
);

export const getCartItems = createSelector(
  getCartState,
  state => values(state.items)
);

export const getCartItemsCount = createSelector(
  getCartItems,
  items => items.length
);

export const getCliente = createSelector(
  getCartState,
  state => state.cliente
);

export const getTipo = createSelector(
  getCartState,
  state => state.tipo
);

export const getCartSumary = createSelector(
  getCartItems,
  items => {
    const importe = round(sumBy(items, 'importe'), 2);
    const descuentoImporte = round(sumBy(items, 'descuentoImporte'), 2);
    const subtotal = round(sumBy(items, 'subtotal'), 2);
    const impuesto = round(sumBy(items, 'impuesto'), 2);
    const total = round(sumBy(items, 'total'), 2);
    const maxDes = maxBy(items, 'descuento');
    const descuento = maxDes ? maxDes.descuento : 0.0;
    return {
      importe,
      descuentoImporte,
      subtotal,
      impuesto,
      total,
      descuento
    };
  }
);

export const getCartEntity = createSelector(
  getCartState,
  getCliente,
  getCartItems,
  getCartSumary,
  (state, cliente, items, sumary) => {
    return {
      fecha: new Date().toISOString(),
      sucursal: 'CALL CENTER',
      tipo: 'COD',
      formaDePago: FormaDePago.EFECTIVO,
      moneda: 'MXN',
      tipoDeCambio: 1.0,
      usoDeCfdi: 'G03',
      cliente: { id: cliente.id },
      nombre: cliente.nombre,
      rfc: cliente.rfc,
      partidas: items,
      ...sumary
    };
  }
);
