import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CART_FEATURE_KEY, CartState } from './cart.reducer';

import { Pedido, TipoDePedido } from '@swrx/core-model';
import { CartSumary, CartItem, CartFormState } from './cart.models';

import sumBy from 'lodash/sumBy';
import round from 'lodash/round';
import maxBy from 'lodash/maxBy';
import values from 'lodash/values';
import {
  calcularDescuentoPorVolumen,
  buildPedidoEntity,
  buildCartSumary
} from './cart.utils';

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
  (items): CartSumary => buildCartSumary(items)
);

export const getCartEntity = createSelector(
  getCartState,
  getCliente,
  getCartItems,
  getCartSumary,
  (state, cliente, items, summary): Pedido => {
    return buildPedidoEntity(state, cliente, items, summary);
  }
);

export const getDescuentoPorVolumenImporte = createSelector(
  getCartState,
  getCartItems,
  (state, items): number => {
    if (
      state.tipo === TipoDePedido.CONTADO ||
      state.tipo === TipoDePedido.COD
    ) {
      const importe = sumBy(items, (i: CartItem) => {
        if (i.producto.modoVenta === 'B') {
          return i.importe;
        } else {
          return 0.0;
        }
      });
      return importe;
    } else {
      return 0.0;
    }
  }
);

export const getDescuentoPorVolumen = createSelector(
  getCartState,
  getDescuentoPorVolumenImporte,
  (state, importe) => {
    if (
      state.tipo !== TipoDePedido.CONTADO &&
      state.tipo !== TipoDePedido.COD
    ) {
      return 0.0;
    }
    return calcularDescuentoPorVolumen(importe);
  }
);

export const getDescuento = createSelector(
  getTipo,
  getCliente,
  getDescuentoPorVolumen,
  (tipo, cliente, descuentoPorVolumen) => {
    switch (tipo) {
      case TipoDePedido.CREDITO: {
        return cliente.credito ? cliente.credito.descuentoFijo : 0.0;
      }
      case TipoDePedido.CONTADO:
      case TipoDePedido.COD: {
        return descuentoPorVolumen;
      }
      case TipoDePedido.POST_FECHADO: {
        return descuentoPorVolumen - 4;
      }
      default: {
        console.log('Tipo de venta no califica para descuento tipo: ', tipo);
        return 0;
      }
    }
  }
);

/**
 *  State selector to get the CartFormState
 */
export const selectFormState = createSelector(
  getCartState,
  (state): CartFormState => {
    return {
      tipo: state.tipo,
      formaDePago: state.formaDePago,
      usoDeCfdi: state.usoDeCfdi
    };
  }
);

export const selectCurrentPedido = createSelector(
  getCartState,
  state => state.pedido
);

export const getValidationErrors = createSelector(
  getCartState,
  state => state.validationErrors
);

export const getValidationWarnings = createSelector(
  getCartState,
  state => state.validationErrors
);
