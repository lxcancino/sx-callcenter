import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Update } from '@ngrx/entity';
import { Subject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

import { Deposito } from '../+state/depositos.models';
import { Pedido, FormaDePago } from '@swrx/core-model';

const depositoValidator: ValidatorFn = (
  form: FormGroup
): ValidationErrors | null => {
  if (!form.get('transferencia').value) {
    const control = form.get('importes');
    const { efectivo, cheque, tarjeta } = control.value;
    const total = efectivo + cheque + tarjeta;
    return total > 0.0 ? null : { importesInvalidos: true };
  }
  return null;
};

@Component({
  selector: 'swrx-deposito-edit',
  templateUrl: './deposito-edit.component.html',
  styleUrls: ['./deposito-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositoEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();
  deposito: Deposito;
  constructor(
    private dialogRef: MatDialogRef<DepositoEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deposito = data.deposito;
  }

  limitDate = new Date().toISOString();

  ngOnInit() {
    this.buildForm();
    if (this.deposito) {
      this.form.patchValue(this.deposito, { emitEvent: false });
      console.log('Form: ', this.form.getRawValue());
      // this.form.get('cliente').setValue(this.deposito.cliente);
    }

    this.transfernciaListener();
    this.totalListener();
    this.pedidoListener();

    if (!this.isEditable()) {
      this.form.disable();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = new FormGroup(
      {
        pedido: new FormControl(null),
        cliente: new FormControl(null, [Validators.required]),
        sucursal: new FormControl(null, [Validators.required]),
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
        importes: new FormGroup({
          efectivo: new FormControl(0.0, [Validators.min(0.0)]),
          cheque: new FormControl(0.0, [Validators.min(0.0)]),
          tarjeta: new FormControl(0.0, [Validators.min(0.0)])
        }),
        referencia: new FormControl(null, [Validators.required])
      },
      depositoValidator
    );
  }

  private pedidoListener() {
    this.form
      .get('pedido')
      .valueChanges.pipe(
        // skip(1),
        takeUntil(this.destroy$)
      )
      .subscribe((pedido: Pedido) => {
        const f = this.form;
        const cliente = f.get('cliente');
        const sucursal = f.get('sucursal');
        const impF = f.get('importes') as FormGroup;
        const efectivo = impF.get('efectivo');
        const cheque = impF.get('cheque');
        const transferencia = f.get('transferencia');
        const total = f.get('total');
        console.log('Pedido: ', pedido);
        if (pedido) {
          cliente.disable();
          if (pedido.cliente) {
            cliente.setValue(pedido.cliente);
          }
          sucursal.disable();
          if (pedido.sucursal) {
            sucursal.setValue(pedido.sucursal);
          }

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
          sucursal.setValue(null);
          cliente.enable();
          sucursal.enable();
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
      const changes = this.getChanges();
      const update: Update<Deposito> = {
        id: this.deposito.id,
        changes
      };
      this.dialogRef.close(update);
    }
  }

  onCerrar() {
    if (this.deposito.estado === 'AUTORIZADO') {
      const update: Update<Deposito> = {
        id: this.deposito.id,
        changes: { cerrado: true, cerradoTime: new Date().toISOString() }
      };
      this.dialogRef.close(update);
    }
  }

  getChanges(): Partial<Deposito> {
    const data: any = this.form.getRawValue();
    const { cliente, cuenta, sucursal, pedido, fechaDeposito } = data;
    const deposito = { ...data };
    deposito.cliente = {
      id: cliente.id,
      nombre: cliente.nombre,
      rfc: cliente.rfc
    };
    deposito.nombre = cliente.nombre;
    deposito.rfc = this.deposito.rfc;
    deposito.cuenta = {
      id: cuenta.id,
      descripcion: cuenta.descripcion,
      numero: cuenta.numero
    };
    deposito.rechazo = null;
    deposito.estado = 'PENDIENTE';
    deposito.sucursal = sucursal;
    if (pedido) {
      deposito.pedido = pedido;
    }

    deposito.fechaDeposito =
      typeof fechaDeposito === 'string'
        ? fechaDeposito
        : fechaDeposito.toISOString();
    return deposito;
  }

  get tipo() {
    return this.isTransferencia() ? 'Transferencia' : 'Depósito';
  }

  isTransferencia() {
    return this.form.get('transferencia').value;
  }

  isEditable() {
    return this.deposito.estado === 'RECHAZADO';
    // return true;
  }
}
