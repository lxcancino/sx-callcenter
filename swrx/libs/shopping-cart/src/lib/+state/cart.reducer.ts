import { createReducer, on, Action } from '@ngrx/store';

import * as CartActions from './cart.actions';
import { CartItem, CartValidationError } from './cart.models';

import { clienteMostrador, aplicarDescuentos, normalize } from './cart.utils';
import {
  Cliente,
  TipoDePedido,
  FormaDePago,
  Pedido,
  InstruccionDeEnvio
} from '@swrx/core-model';

import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import forIn from 'lodash/forIn';
import { generarCargoPorTarjeta } from './cart-cargos-utils';
import { ValidationErrors } from '@angular/forms';
import { runValidation } from './cart-validations';
import { runWarnings } from './cart-warnings';

export const CART_FEATURE_KEY = 'cart';

export interface CartState {
  selectedId?: string | number; // which cart record has been selected
  sucursal: string;
  cliente: Partial<Cliente>;
  tipo: TipoDePedido;
  formaDePago: FormaDePago;
  usoDeCfdi: string;
  cfdiMail?: string;
  items: { [id: string]: CartItem };
  loading: boolean;
  pedido?: Pedido;
  envio?: InstruccionDeEnvio;
  error?: string | null; // last none error (if any)
  validationErrors: CartValidationError[];
  warrnings: { error: string; descripcion: string }[];
}

export interface CartPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}

export const initialState: CartState = {
  loading: false,
  sucursal: 'CF5FEBRERO',
  cliente: clienteMostrador(),
  tipo: TipoDePedido.CONTADO,
  formaDePago: FormaDePago.EFECTIVO,
  usoDeCfdi: null,
  items: keyBy([], 'id'),
  validationErrors: [],
  warrnings: []
};

const cartReducer = createReducer(
  initialState,
  on(CartActions.addCartItemSuccess, (state, { item }) => ({
    ...state,
    items: { ...state.items, [item.id]: item },
    loading: false
  })),
  on(CartActions.deleteItem, (state, { item }) => {
    const { [item.id]: result, ...items } = state.items;
    return {
      ...state,
      items
    };
  }),
  on(CartActions.cambiarClienteSuccess, (state, { cliente }) => ({
    ...state,
    cliente,
    cfdiMail: cliente.cfdiMail
  })),
  on(CartActions.cambiarClienteError, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CartActions.cambiarTipo, (state, { tipo }) => ({ ...state, tipo })),
  on(CartActions.cambiarFormaDePago, (state, { formaDePago }) => {
    const partidas = values(state.items);
    let newPartidas = normalize(partidas);
    if (
      formaDePago === FormaDePago.TARJETA_CRE ||
      formaDePago === FormaDePago.TARJETA_DEB
    ) {
      const cargo = generarCargoPorTarjeta(partidas, state.tipo, formaDePago);
      if (cargo !== null) {
        newPartidas = [...partidas, cargo];
      }
    }
    const items = keyBy(newPartidas, 'id');
    return {
      ...state,
      formaDePago,
      items
    };
  }),
  on(CartActions.cambiarUsoDeCfdi, (state, { clave }) => ({
    ...state,
    usoDeCfdi: clave
  })),
  on(CartActions.cambiarCfdiMail, (state, { email }) => ({
    ...state,
    cfdiMail: email
  })),
  on(CartActions.recalcularPartidas, state => {
    const partidas = values(state.items);
    const items = keyBy(
      aplicarDescuentos(partidas, state.tipo, state.cliente),
      'id'
    );
    return { ...state, items };
  }),
  on(CartActions.editItemSuccess, (state, { item }) => {
    const items = {
      ...state.items,
      [item.id]: item
    };
    return {
      ...state,
      items
    };
  }),
  on(CartActions.loadPedidoSucces, (state, { pedido }) => {
    const items = keyBy(pedido.partidas, 'id');
    return {
      ...state,
      loading: false,
      pedido,
      cliente: pedido.cliente,
      tipo: pedido.tipo,
      formaDePago: pedido.formaDePago,
      sucursal: pedido.sucursal,
      usoDeCfdi: pedido.usoDeCfdi,
      cfdiMail: pedido.cfdiMail,
      items
    };
  }),
  on(CartActions.cleanShoppingCart, state => ({
    ...initialState
  })),
  on(CartActions.validarPedido, state => ({
    ...state,
    validationErrors: runValidation(state),
    warrnings: runWarnings(state)
  }))
);

export function reducer(state: CartState | undefined, action: Action) {
  return cartReducer(state, action);
}
