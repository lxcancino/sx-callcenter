import { CartState } from './cart.reducer';
import { TipoDePedido, FormaDePago } from '@swrx/core-model';

import sumBy from 'lodash/sumBy';
import values from 'lodash/values';
import { CartValidationError } from './cart.models';

export function runValidation(state: CartState): CartValidationError[] {
  const errors: CartValidationError[] = [];

  minimoDeVenta(state, errors);
  maximoEnEfectivo(state, errors);
  //Vta a credito
  const vtaCredito = ventaCredito(state);
  if (vtaCredito) {
    errors.push(vtaCredito);
  }
  validarCod(state, errors);
  validarCheque(state, errors);
  validarChequePsf(state, errors);
  validarJuridico(state, errors);
  validarChequesDevueltos(state, errors);
  validarUnionDeCredito(state, errors);
  return errors;
}

export function minimoDeVenta(state: CartState, errors: any[]) {
  const importe = sumBy(Object.values(state.items), 'subtotal');
  if (importe < 10.0) {
    errors.push({
      error: 'MINIMO_DE_VENTA',
      descripcion: '  EL IMPORTE MINIMO DE VENTA ES: $10.00'
    });
  }
}
export function maximoEnEfectivo(state: CartState, errors: any[]) {
  if (state.formaDePago === FormaDePago.EFECTIVO) {
    const importe = sumBy(Object.values(state.items), 'subtotal');
    if (importe > 100000.0) {
      errors.push({
        error: 'LIMITE_EFECTIVO',
        descripcion: 'EL IMPORTE MAXIMO DE EFECTIVO ES: $100,000.00'
      });
    }
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
    } else {
      if (credito.postfechado) {
        if (state.formaDePago !== FormaDePago.CHEQUE_PSTF) {
          return {
            error: 'SOLO_CHEQUE_POSTFECHADO',
            descripcion:
              'EL CLIENTE EN CREDITO SOLO PERMITE CHEQUE POST FECHADO'
          };
        }
      }
    }
  }
  return null;
}

export function validarCod(state: CartState, errors: CartValidationError[]) {
  if (state.tipo === TipoDePedido.COD) {
    const validas =
      state.formaDePago === FormaDePago.CHEQUE ||
      state.formaDePago === FormaDePago.EFECTIVO;
    if (!validas) {
      errors.push({
        error: 'VANTA_COD',
        descripcion: 'EN COD SOLO CHEQUE o EFECTIVO'
      });
    }
    if (!state.envio) {
      errors.push({
        error: 'COD_SIN_ENVIO',
        descripcion: 'VENTA COD REQUIERE INSTRUCCION DE ENVIO'
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
export function validarChequePsf(
  state: CartState,
  errors: CartValidationError[]
) {
  if (state.formaDePago === FormaDePago.CHEQUE_PSTF) {
    const cliente = state.cliente;
    const credito = cliente.credito;
    if (!credito || !credito.postfechado) {
      errors.push({
        error: 'PERMITIR_CHEQUE_PSF',
        descripcion: 'CLIENTE NO AUTORIZADO PARA CHEQUE POST FECHADO'
      });
    }
    if (state.tipo !== TipoDePedido.CREDITO) {
      errors.push({
        error: 'CHEQUE_PSF_SOLO_CREDITO',
        descripcion: 'CHEQUE POST FECHADO SOLO SE PERMITE EN TIPO CREDITO'
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

export function validarUnionDeCredito(
  state: CartState,
  errors: CartValidationError[]
) {
  if (state.cliente.clave === 'U050008') {
    if (!state.socio) {
      errors.push({
        error: 'SOCIO_DE_UNION',
        descripcion: 'DEBE REGISTRAR UN SOCIO PARA LA UNION DE CREDITO'
      });
    }
  }
}
