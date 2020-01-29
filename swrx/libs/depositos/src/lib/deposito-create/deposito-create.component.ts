import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';

import { MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Deposito } from '../+state/depositos.models';
import { Pedido, FormaDePago } from '@swrx/core-model';

const depositoValidator: ValidatorFn = (
  control: any
): ValidationErrors | null => {
  const { efectivo, cheque, tarjeta } = control.value;
  const total = efectivo + cheque + tarjeta;
  return total > 0.0 ? null : { importesInvalidos: true };
};

@Component({
  selector: 'swrx-deposito-create',
  templateUrl: './deposito-create.component.html',
  styleUrls: ['./deposito-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositoCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();
  constructor(private dialogRef: MatDialogRef<DepositoCreateComponent>) {}

  limitDate = new Date().toISOString();

  ngOnInit() {
    this.buildForm();
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = new FormGroup({
      pedido: new FormControl(null),
      cliente: new FormControl(null, [Validators.required]),
      banco: new FormControl(null, [Validators.required]),
      cuenta: new FormControl(null, [Validators.required]),
      fecha: new FormControl(
        { value: new Date().toISOString(), disabled: true },
        [Validators.required]
      ),
      fechaDeposito: new FormControl(new Date().toISOString(), [
        Validators.required
      ]),
      transferencia: new FormControl(true),
      total: new FormControl(0.0, [Validators.required, Validators.min(1.0)]),
      importes: new FormGroup(
        {
          efectivo: new FormControl(0.0, [Validators.min(0.0)]),
          cheque: new FormControl(0.0, [Validators.min(0.0)]),
          tarjeta: new FormControl(0.0, [Validators.min(0.0)])
        },
        depositoValidator
      ),
      referencia: new FormControl(null, [Validators.required])
    });
    this.form.get('importes').disable();
    this.transfernciaListener();
    this.totalListener();
    this.pedidoListener();
  }

  private pedidoListener() {
    this.form
      .get('pedido')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((pedido: Pedido) => {
        const f = this.form;
        const cliente = f.get('cliente');
        const impF = f.get('importes') as FormGroup;
        const efectivo = impF.get('efectivo');
        const cheque = impF.get('cheque');
        const transferencia = f.get('transferencia');
        const total = f.get('total');
        console.log('Pedido: ', pedido);
        if (pedido) {
          cliente.disable();
          cliente.setValue(pedido.cliente);

          switch (pedido.formaDePago) {
            case FormaDePago.DEPOSITO_EFECTIVO:
              efectivo.setValue(pedido.total);
              transferencia.setValue(false);
              break;
            case FormaDePago.DEPOSITO_CHEQUE:
              cheque.setValue(pedido.total);
              transferencia.setValue(false);
              break;
            default:
              transferencia.setValue(true);
              total.setValue(pedido.total);
              break;
          }
        } else {
          cliente.setValue(null);
          cliente.enable();
          f.patchValue({ total: 0.0, transferencia: true });
        }
      });
  }

  private transfernciaListener() {
    this.form
      .get('transferencia')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(trs => {
        const ctrl: FormGroup = this.form.get('importes') as FormGroup;
        const totCtrl: FormGroup = this.form.get('total') as FormGroup;
        if (trs) {
          ctrl.disable();
          ctrl.setValue({ efectivo: 0.0, cheque: 0.0, tarjeta: 0.0 });
          totCtrl.enable();
        } else {
          ctrl.enable();
          totCtrl.disable();
        }
      });
  }

  private totalListener() {
    this.form
      .get('importes')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(imp => {
        const { efectivo, cheque, tarjeta } = imp;
        const total = efectivo + cheque + tarjeta;
        this.form.get('total').setValue(total);
      });
  }

  submit() {
    if (this.form.valid) {
      const d: Deposito = this.buildDeposito();
      this.dialogRef.close(d);
    }
  }

  buildDeposito(): Deposito {
    const data: any = this.form.getRawValue();
    const { cliente, cuenta, pedido } = data;
    const deposito = { ...data };
    deposito.nombre = cliente.nombre;
    deposito.cliente = {
      id: cliente.id,
      nombre: cliente.nombre,
      rfc: cliente.rfc
    };
    deposito.rfc = cliente.rfc;
    deposito.cuenta = {
      id: cuenta.id,
      descripcion: cuenta.descripcion,
      numero: cuenta.numero
    };
    if (pedido) {
      deposito.pedido = {
        id: pedido.id,
        folio: pedido.folio,
        fecha: pedido.fecha,
        total: pedido.total,
        formaDePago: pedido.formaDePago
      };
    }
    return deposito;
  }

  get tipo() {
    return this.isTransferencia() ? 'Transferencia' : 'Depósito';
  }

  isTransferencia() {
    return this.form.get('transferencia').value;
  }
}
