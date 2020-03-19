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
  ValidationErrors,
  AbstractControl,
  AsyncValidatorFn
} from '@angular/forms';

import { MatDialogRef } from '@angular/material';
import { Subject, Observable, of, combineLatest } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { Deposito } from '../+state/depositos.models';
import { Pedido, FormaDePago } from '@swrx/core-model';

import * as moment from 'moment';
import { DepositoService } from '../services/deposito.service';

@Component({
  selector: 'swrx-deposito-create',
  templateUrl: './deposito-create.component.html',
  styleUrls: ['./deposito-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositoCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();
  posibleDuplicado: Deposito = null;
  constructor(
    private dialogRef: MatDialogRef<DepositoCreateComponent>,
    private service: DepositoService
  ) {}

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
      referencia: new FormControl(null, {
        validators: [Validators.required],
        updateOn: 'blur'
      })
    });
    this.form.get('importes').disable();
    this.transfernciaListener();
    this.totalListener();
    this.pedidoListener();
    this.noDucicadoListener();
  }

  private pedidoListener() {
    this.form
      .get('pedido')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((pedido: Pedido) => {
        const f = this.form;
        const cliente = f.get('cliente');
        const sucursal = f.get('sucursal');
        const impF = f.get('importes') as FormGroup;
        const efectivo = impF.get('efectivo');
        const cheque = impF.get('cheque');
        const transferencia = f.get('transferencia');
        const total = f.get('total');
        // console.log('Pedido: ', pedido);
        if (pedido) {
          cliente.disable();
          sucursal.disable();
          cliente.setValue(pedido.cliente);
          sucursal.setValue(pedido.sucursal);
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

  private noDucicadoListener() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      const { banco, cuenta, fechaDeposito, total } = val;
      const fdeposito = moment(fechaDeposito).toDate();
      if (banco && cuenta && fdeposito && total) {
        this.service.buscarDuplicado(total, banco).subscribe(response => {
          if (Array.isArray(response) && response.length > 0) {
            const found = response[0];
            this.posibleDuplicado = found;
          } else {
            this.posibleDuplicado = null;
          }
        });
      }
    });
    /*
    const banco$ = this.form
      .get('banco')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const cuenta$ = this.form
      .get('cuenta')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const fechaDeposito$ = this.form
      .get('fechaDeposito')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const total$ = this.form
      .get('total')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const groupo$ = combineLatest(banco$, cuenta$, fechaDeposito$, total$);
    groupo$.subscribe(val => console.log('Value: ', val));
    */
  }

  submit() {
    if (this.form.valid) {
      const d: Deposito = this.buildDeposito();
      // console.log('Deposito: ', d);
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
    deposito.cerrado = false;
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
