import { createReducer, on, Action } from '@ngrx/store';

import * as CartActions from './cart.actions';
import { CartItem, CartValidationError } from './cart.models';

import { clienteMostrador, aplicarDescuentos } from './cart.utils';
import {
  Cliente,
  Socio,
  TipoDePedido,
  FormaDePago,
  Pedido,
  InstruccionDeEnvio
} from '@swrx/core-model';

import keyBy from 'lodash/keyBy';
import values from 'lodash/values';

import {
  generarCargoPorTarjeta,
  generarCargoPorCorte
} from './cart-cargos-utils';

import { runValidation } from './cart-validations';
import { runWarnings } from './cart-warnings';
import { resolveAutorizaciones } from './cart-autorizaciones';

export const CART_FEATURE_KEY = 'cart';

export interface CartState {
  selectedId?: string | number; // which cart record has been selected
  sucursal: string;
  cliente: Partial<Cliente>;
  nombre: string;
  tipo: TipoDePedido;
  formaDePago: FormaDePago;
  usoDeCfdi?: string;
  cfdiMail?: string;
  items: { [id: string]: CartItem };
  loading: boolean;
  pedido?: Pedido;
  envio?: InstruccionDeEnvio;
  comprador?: string;
  descuentoEspecial?: number;
  socio?: Socio;
  error?: string | null; // last none error (if any)
  dirty: boolean;
  comentario?: string;
  validationErrors: CartValidationError[];
  warrnings: { error: string; descripcion: string }[];
  autorizacionesRequeridas?: string;
}

export interface CartPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}

export const initialState: CartState = {
  loading: false,
  sucursal: 'CF5FEBRERO',
  cliente: clienteMostrador(),
  nombre: 'MOSTRADOR',
  tipo: TipoDePedido.CONTADO,
  formaDePago: FormaDePago.EFECTIVO,
  items: keyBy([], 'id'),
  validationErrors: [],
  warrnings: [],
  envio: undefined,
  dirty: false
};

const cartReducer = createReducer(
  initialState,
  on(CartActions.addCartItemSuccess, (state, { item }) => ({
    ...state,
    dirty: true,
    items: { ...state.items, [item.id]: item },
    loading: false,
    descuentoEspecial: state.descuentoEspecial ? 0 : undefined
  })),
  on(CartActions.deleteItem, (state, { item }) => {
    const { [item.id]: result, ...items } = state.items;
    return {
      ...state,
      dirty: true,
      items
    };
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

  on(CartActions.cambiarClienteSuccess, (state, { cliente }) => ({
    ...state,
    cliente,
    nombre: cliente.nombre,
    cfdiMail: cliente.cfdiMail
  })),
  on(CartActions.cambiarClienteError, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CartActions.cambiarNombreSuccess, (state, { nombre }) => ({
    ...state,
    nombre: nombre
  })),
  on(CartActions.cambiarTipo, (state, { tipo }) => ({ ...state, tipo })),
  on(CartActions.cambiarFormaDePago, (state, { formaDePago }) => ({
    ...state,
    formaDePago
  })),
  on(CartActions.cambiarUsoDeCfdi, (state, { clave }) => ({
    ...state,
    usoDeCfdi: clave
  })),
  on(CartActions.cambiarCfdiMail, (state, { email }) => ({
    ...state,
    cfdiMail: email
  })),
  on(CartActions.cambiarSucursal, (state, { sucursal }) => ({
    ...state,
    sucursal
  })),
  on(CartActions.cambiarComprador, (state, { comprador }) => ({
    ...state,
    comprador
  })),
  on(CartActions.cambiarComentario, (state, { comentario }) => ({
    ...state,
    comentario
  })),
  on(CartActions.registrarEnvioSuccess, (state, { envio }) => ({
    ...state,
    envio
  })),
  on(CartActions.cancelarEnvio, state => ({
    ...state,
    envio: null
  })),
  on(CartActions.recalcularPartidas, state => {
    const partidas = values(state.items);

    const partidasActualizadas = aplicarDescuentos(
      partidas,
      state.tipo,
      state.formaDePago,
      state.cliente,
      state.descuentoEspecial
    );

    //const partidasActualizadas = recalcularPartidas(state);
    let items = keyBy(partidasActualizadas, 'id');

    if (
      state.formaDePago === FormaDePago.TARJETA_CRE ||
      state.formaDePago === FormaDePago.TARJETA_DEB
    ) {
      const cargo = generarCargoPorTarjeta(
        partidasActualizadas,
        state.tipo,
        state.formaDePago
      );
      if (cargo !== null) {
        items = { ...items, [cargo.id]: cargo };
      }
    }
    const corteItem = generarCargoPorCorte(partidasActualizadas);
    if (corteItem) {
      items = { ...items, [corteItem.id]: corteItem };
    }
    return { ...state, items };
  }),

  on(CartActions.loadPedidoSucces, (state, { pedido }) => {
    const items = keyBy(pedido.partidas, 'id');
    return {
      ...state,
      loading: false,
      pedido,
      cliente: pedido.cliente,
      nombre: pedido.nombre,
      tipo: pedido.tipo,
      formaDePago: pedido.formaDePago,
      sucursal: pedido.sucursal,
      usoDeCfdi: pedido.usoDeCfdi,
      cfdiMail: pedido.cfdiMail,
      items,
      envio: pedido.envio,
      socio: pedido.socio,
      descuentoEspecial: pedido.descuentoEspecial
    };
  }),
  on(CartActions.cleanShoppingCart, state => ({
    ...initialState
  })),
  on(CartActions.validarPedido, state => ({
    ...state,
    validationErrors: runValidation(state),
    warrnings: runWarnings(state),
    autorizacionesRequeridas: resolveAutorizaciones(state)
  })),
  on(CartActions.asignarSocio, (state, { socio }) => {
    return {
      ...state,
      dirty: true,
      socio
    };
  }),
  on(
    CartActions.assignarDescuentoEspecialSuccess,
    (state, { descuentoEspecial }) => ({
      ...state,
      descuentoEspecial
    })
  )
);

export function reducer(state: CartState | undefined, action: Action) {
  return cartReducer(state, action);
}
