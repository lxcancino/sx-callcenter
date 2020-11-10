import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import {
  Cliente,
  ClienteCredito,
  FormaDePago,
  PedidoParams,
  TipoDePedido,
} from '@models';

export const ErrorKeys = { CeditoRequerido: 'creditoRequerido' };

/**
 * Validators para ventas de credito
 */
export class CreditoValidators {
  /**
   * En ventas tipo CRE el ClienteCredito es requerido
   */
  static CreditoRequired(formGroup: FormGroup): ValidationErrors | null {
    const tipo: TipoDePedido = formGroup.get('tipo').value;

    if (tipo !== TipoDePedido.CREDITO) {
      return null;
      // don't validate other than CREDITO
    }

    const cliente: Cliente = formGroup.get('cliente').value;

    if (!cliente) {
      return null;
    }
    const credito = cliente.credito;
    return !credito ? { creditoRequerido: true } : null;
  }

  static PostFechadoRequerido(formGroup: FormGroup): ValidationErrors | null {
    const credito: ClienteCredito = formGroup.get('credito').value;
    if (!credito) return null; // No validar
    if (!credito.postfechado) return null; // No validar
    const formaDePago: FormaDePago = formGroup.get('formaDePago').value;

    return formaDePago !== FormaDePago.CHEQUE_PSTF
      ? { postFechadoRequerido: true }
      : null;
  }

  static PostFechadoNoPermitido(form: FormGroup) {
    const postFechado =
      form.get('formaDePago').value === FormaDePago.CHEQUE_PSTF;
    const credito = form.get('tipo').value === TipoDePedido.CREDITO;
    return postFechado
      ? !credito
        ? { postFechadoNoPermitido: true }
        : null
      : null;
  }
}
