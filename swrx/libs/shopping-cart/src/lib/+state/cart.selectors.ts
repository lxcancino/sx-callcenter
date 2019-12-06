import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CART_FEATURE_KEY, CartState } from './cart.reducer';
import { CartSumary, CartItem } from './cart.models';
import { Observable } from 'rxjs';

import { Pedido, TipoDePedido, FormaDePago } from '@swrx/core-model';

import sumBy from 'lodash/sumBy';
import round from 'lodash/round';
import maxBy from 'lodash/maxBy';
import values from 'lodash/values';
import { calcularDescuentoPorVolumen } from './cart.utils';

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
  (state, cliente, items, sumary): Pedido => {
    return {
      fecha: new Date().toISOString(),
      sucursal: 'CALL CENTER',
      tipo: state.tipo,
      formaDePago: FormaDePago.EFECTIVO,
      moneda: 'MXN',
      tipoDeCambio: 1.0,
      usoDeCfdi: 'G03',
      cliente: { id: cliente.id },
      nombre: cliente.nombre,
      rfc: cliente.rfc,
      partidas: items,
      kilos: sumBy(items, 'kilos'),
      ...sumary
    };
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
        if(i.producto.modoVenta === 'B') {
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
    if(state.tipo !== TipoDePedido.CONTADO && state.tipo !== TipoDePedido.COD) {
      return 0.0;
    }
    return calcularDescuentoPorVolumen(importe)
  }
)

export const getDescuento = createSelector(
  getTipo,
  getCliente,
  getDescuentoPorVolumen,
  (tipo, cliente, descuentoPorVolumen) => {
    switch(tipo) {
      case TipoDePedido.CREDITO: {
        return cliente.credito ? cliente.credito.descuentoFijo : 0.0;
      }
      case TipoDePedido.CONTADO:
      case TipoDePedido.COD: {
        return descuentoPorVolumen;  
      }
      case TipoDePedido.PSF: {
        return descuentoPorVolumen - 4;  
      }
      default: {
        console.log('Tipo de venta no califica para descuento tipo: ', tipo);
        return 0;
      }
    }
    
  }
)
