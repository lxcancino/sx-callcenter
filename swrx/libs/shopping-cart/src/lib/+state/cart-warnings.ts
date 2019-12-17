import { CartState } from './cart.reducer';
import { TipoDePedido, FormaDePago } from '@swrx/core-model';

import sumBy from 'lodash/sumBy';
import round from 'lodash/round';
import values from 'lodash/values';
import { CartValidationError } from './cart.models';

export function runWarnings(state: CartState): CartValidationError[] {
  const errors: CartValidationError[] = [];
  validarClienteActivo(state, errors);
  validarCreditoVigente(state, errors);
  validarAtrasoMaximo(state, errors);
  validarCreditoVigente(state, errors);
  validarCreditoDisponible(state, errors);
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
