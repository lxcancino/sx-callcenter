import { CartState } from './cart.reducer';
import { TipoDePedido } from '@swrx/core-model';
import { ValidationErrors } from '@angular/forms';

import sumBy from 'lodash/sumBy';

export class CartValidationError {
  error: string;
  descripcion: string;
}

export enum TipoDeValidacion {
  MINIMO_DE_VENTA,
  VENTA_DE_CREDITO
}

export function runValidation(state: CartState): CartValidationError[] {
  console.log('Validando CartState: ', state);
  const errors: CartValidationError[] = [];

  minimoDeVenta(state, errors);
  //Vta a credito
  const vtaCredito = ventaCredito(state);
  if (vtaCredito) {
    errors.push(vtaCredito);
  }
  return errors;
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

export function minimoDeVenta(state: CartState, errors: any[]) {
  const importe = sumBy(state.items, 'importe');
  if (importe < 10.0) {
    errors.push({
      error: 'MINIMO_DE_VENTA',
      descripcion: 'El importe mínimo de venta es $10.00'
    });
  }
}
