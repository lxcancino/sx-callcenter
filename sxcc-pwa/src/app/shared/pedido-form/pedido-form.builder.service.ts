import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import { map, withLatestFrom, tap } from 'rxjs/operators';

import {
  Pedido,
  PedidoDet,
  PedidoParams,
  PedidoItemParams,
  TipoDePedido,
  FormaDePago,
  Cliente,
  PedidoImportes,
} from 'src/app/models';

import sumBy from 'lodash-es/sumBy';
import maxBy from 'lodash-es/maxBy';

export interface PedidoControls {
  id?: AbstractControl;
  nombre: AbstractControl;
  cliente: AbstractControl;
  tipo: AbstractControl;
  formaDePago: AbstractControl;
}

const toParams = (form: FormGroup): PedidoParams => {
  return {
    tipo: form.value.tipo,
    formaDePago: form.value.formaDePago,
    cliente: form.value.cliente,
    credito: form.value.cliente.credito,
    descuentoEspecial: form.value.descuentoEspecial,
  };
};

@Injectable()
export class PedidoFormBuilderService {
  form: FormGroup = this.buildForm();
  tipo$ = this.form.get('tipo').valueChanges;
  formaDePago$ = this.form.get('formaDePago').valueChanges;
  partidas$: Observable<PedidoDet[]> = this.form.get('partidas').valueChanges;

  recalaulo$ = combineLatest([this.tipo$, this.formaDePago$]).pipe(
    map(([tipo, formaDePago]) => ({ tipo, formaDePago }))
  );

  params$: Observable<PedidoParams> = merge(
    this.tipo$.pipe(map((value) => ({ tipo: value }))),
    this.formaDePago$.pipe(map((value) => ({ formaDePago: value })))
  ).pipe(
    map((source) => ({ ...toParams(this.form), ...source })),
    tap((params) => this.recalcular(params))
  );

  descuento$ = this.partidas$.pipe(
    tap((partidas) => {
      console.log('Calcular el descuento');
      return 0.0;
    })
  );

  sumary$: Observable<PedidoImportes> = combineLatest([this.partidas$]).pipe(
    map(([partidas]) => ({
      importe: sumBy(partidas, 'importe'),
      descuentoImporte: sumBy(partidas, 'descuentoImporte'),
      subtotal: sumBy(partidas, 'subtotal'),
      impuesto: sumBy(partidas, 'impuesto'),
      total: sumBy(partidas, 'total'),
      kilos: sumBy(partidas, 'kilos'),
    })),
    tap((totales) => this.form.patchValue({ ...totales }))
  );

  constructor(private fb: FormBuilder) {}

  private buildForm(): FormGroup {
    return this.fb.group({
      sucursal: [null, [Validators.required]],
      cliente: [null, [Validators.required]],
      nombre: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255),
        ],
      ],
      fecha: [
        { value: new Date().toISOString(), disabled: true },
        [Validators.required],
      ],
      tipo: [null, [Validators.required]],
      formaDePago: [null, [Validators.required]],
      descuentoEspecial: [0.0],
      partidas: this.fb.array([]),
      importe: [],
      descuentoImporte: [],
      subtotal: [],
      impuesto: [],
      total: [],
    });
  }

  addPartidas(...items: PedidoDet[]) {
    const partidas = this.form.get('partidas') as FormArray;
    items.forEach((item) => partidas.push(new FormControl(item)));
  }

  /**
   * Builds an object with the interface of most controls. For simplicity access
   *
   * @param form
   */
  buildPedidoFormControls(form: FormGroup): PedidoControls {
    return {
      cliente: form.get('cliente'),
      nombre: form.get('nombre'),
      tipo: form.get('tipo'),
      formaDePago: form.get('formaDePago'),
    };
  }

  getEditParams(form: FormGroup): PedidoItemParams {
    const controls = this.buildPedidoFormControls(form);
    return {
      tipo: controls.tipo.value,
      formaDePago: controls.formaDePago.value,
      descuento: 0.0,
      descuentoEspecial: form.get('descuentoEspecial').value,
    };
  }

  recalcular(params: PedidoParams) {
    console.log('Recalcular importes: ', params);
  }
}
