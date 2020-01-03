import { CartState } from './cart.reducer';
import { TipoDePedido, FormaDePago } from '@swrx/core-model';

import sumBy from 'lodash/sumBy';
import values from 'lodash/values';
import { CartValidationError } from './cart.models';

export function runValidation(state: CartState): CartValidationError[] {
  const errors: CartValidationError[] = [];

  minimoDeVenta(state, errors);
  //Vta a credito
  const vtaCredito = ventaCredito(state);
  if (vtaCredito) {
    errors.push(vtaCredito);
  }
  validarCod(state, errors);
  validarCheque(state, errors);
  validarJuridico(state, errors);
  validarChequesDevueltos(state, errors);
  return errors;
}

export function minimoDeVenta(state: CartState, errors: any[]) {
  const importe = sumBy(Object.values(state.items), 'importe');
  if (importe < 10.0) {
    errors.push({
      error: 'MINIMO_DE_VENTA',
      descripcion: 'El importe mínimo de venta es $10.00'
    });
  }
}

/**
 * Validar el acceso
 */
export function ventaCredito(state: CartState): CartValidationError | null {
  if (state.tipo === TipoDePedido.CREDITO) {
    const credito = state.cliente.credito;
    if (!credito) {
      return {
        error: 'NO_ES_CLIENTE_CREDITO',
        descripcion: 'EL CLIENTE NO TIENE LINEA DE CREDITO'
      };
    }
  }
  return null;
}

export function validarCod(state: CartState, errors: CartValidationError[]) {
  if (state.tipo === TipoDePedido.COD) {
    if (
      state.formaDePago === FormaDePago.CHEQUE ||
      state.formaDePago === FormaDePago.EFECTIVO
    ) {
      errors.push({
        error: 'VANTA_COD',
        descripcion: 'En COD solo CHEQUE o EFECTIVO'
      });
    }
  }
}

export function validarCheque(state: CartState, errors: CartValidationError[]) {
  if (state.formaDePago === FormaDePago.CHEQUE) {
    if (!state.cliente.permiteCheque) {
      errors.push({
        error: 'PERMITIR_CHEQUE',
        descripcion: 'CLIENTE NO AUTORIZADO PARA CHEQUE'
      });
    }
  }
}

export function validarJuridico(
  state: CartState,
  errors: CartValidationError[]
) {
  if (state.cliente.juridico) {
    errors.push({
      error: 'CLIENTE_JURIDICO',
      descripcion: 'CLIENTE EN TRAMITE JURIDICO'
    });
  }
}

export function validarChequesDevueltos(
  state: CartState,
  errors: CartValidationError[]
) {
  if (state.cliente.chequeDevuelto > 0) {
    errors.push({
      error: 'CHEQUES_DEVUELTOS',
      descripcion: 'CLIENTE CON CHEQUES DEVUELTOS'
    });
  }
}
