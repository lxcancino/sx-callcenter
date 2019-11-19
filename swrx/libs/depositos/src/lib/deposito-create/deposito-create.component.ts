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
      )
    });
    this.form.get('importes').disable();
    this.transfernciaListener();
    this.totalListener();
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
    const { cliente, cuenta } = data;
    const deposito = { ...data };
    deposito.nombre = cliente.nombre;
    deposito.rfc = cliente.rfc;
    deposito.cuenta = {
      id: cuenta.id,
      descripcion: cuenta.descripcion,
      numero: cuenta.numero
    };
    return deposito;
  }

  get tipo() {
    return this.isTransferencia() ? 'Transferencia' : 'Depósito';
  }

  isTransferencia() {
    return this.form.get('transferencia').value;
  }
}
