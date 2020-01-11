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
import { takeUntil } from 'rxjs/operators';

import { Deposito } from '../+state/depositos.models';

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
    this.transfernciaListener();
    this.form.patchValue(this.deposito);
    this.totalListener();

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

  getChanges(): Partial<Deposito> {
    const data: any = this.form.getRawValue();
    const { cliente, cuenta } = data;
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
  }
}
