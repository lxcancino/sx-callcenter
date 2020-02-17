import { CartState } from './cart.reducer';
import {
  TipoDePedido,
  FormaDePago,
  TipoDeAutorizacion
} from '@swrx/core-model';

import sumBy from 'lodash/sumBy';
import round from 'lodash/round';
import values from 'lodash/values';
import { CartValidationError } from './cart.models';

export function runWarnings(state: CartState): CartValidationError[] {
  const errors: CartValidationError[] = [];
  validarClienteActivo(state, errors);
  validarCreditoVigente(state, errors);
  validarAtrasoMaximo(state, errors);
  validarCreditoDisponible(state, errors);
  validarDescuentoEspecial(state, errors);
  return errors;
}

export function validarClienteActivo(state: CartState, errors: any[]) {
  if (!state.cliente.activo) {
    errors.push({
      error: 'CLIENTE_ACTIVO',
      descripcion: 'CLIENTE SUSPENDIDO'
    });
  }
}

export function validarCreditoVigente(
  state: CartState,
  errors: CartValidationError[]
) {
  if (state.tipo === TipoDePedido.CREDITO) {
    if (state.cliente.credito) {
      if (!state.cliente.credito.creditoActivo) {
        errors.push({
          error: 'CREDITO_SUSPENDIDO',
          descripcion: 'CREDITO SUSPENDIDO'
        });
      }
    }
  }
}

export function validarAtrasoMaximo(
  state: CartState,
  errors: CartValidationError[]
) {
  if (state.tipo === TipoDePedido.CREDITO) {
    if (state.cliente.credito) {
      if (state.cliente.credito.atrasoMaximo > 7) {
        errors.push({
          error: 'ATRASO_MAXIMO',
          descripcion: 'CREDITO CON ATRASOS > 7'
        });
      }
    }
  }
}

export function validarCreditoDisponible(
  state: CartState,
  errors: CartValidationError[]
) {
  if (state.tipo === TipoDePedido.CREDITO) {
    if (state.cliente.credito) {
      const credito = state.cliente.credito;
      const disponible = credito.lineaDeCredito - credito.saldo;
      const items = values(state.items);
      const total = round(sumBy(items, 'total'), 2);

      if (disponible < total) {
        errors.push({
          error: 'LINEA_INSUFICIENTE',
          descripcion: 'CREDITO INSUFICIENTE'
        });
      }
    }
  }
}

export function validarDescuentoEspecial(
  state: CartState,
  errors: CartValidationError[]
) {
  if (state.descuentoEspecial > 0) {
    if (state.pedido && state.pedido.autorizacion) {
      // console.log('Autorizacion: ', state.pedido.autorizacion.autorizado);
      return;
    }
    errors.push({
      error: TipoDeAutorizacion.DESCUENTO,
      descripcion: 'DESCUENTO ESPECIAL REQUIERE AUTORIZACION'
    });
  }
  const partidas = Object.values(state.items);
  if (partidas.length > 0) {
    const pendientes = partidas
      .map(item => (item.faltante ? item.faltante : 0))
      .reduce((prev, curr) => prev + curr);

    if (pendientes > 0) {
      if (!state.pedido || !state.pedido.autorizacion) {
        errors.push({
          error: TipoDeAutorizacion.EXISTENCIA,
          descripcion: 'FALTA EXISTENCIA REQUIERE AUTORIZACION'
        });
      }
    }
  }
}
