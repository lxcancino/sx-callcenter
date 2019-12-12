import { CartState } from './cart.reducer';
import { TipoDePedido } from '@swrx/core-model';
import { ValidationErrors } from '@angular/forms';

export class CartValidationError {
  clave: TipoDeValidacion;
  descripcion: string
}

export enum TipoDeValidacion {
  MINIMO_DE_VENTA,
  VENTA_DE_CREDITO
}

/**
 * Valida 
 */
export function ventaCredito(state: CartState): ValidationErrors | null {
  if(state.tipo === TipoDePedido.CREDITO) {
    const credito = state.cliente.credito
    if(!credito) {
      return [{'NO_ES_CLIENTE_CREDITO': 'No es cliente de crédito'}]
    }
  }
  return null;
}


