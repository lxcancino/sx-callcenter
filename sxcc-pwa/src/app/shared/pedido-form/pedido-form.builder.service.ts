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
import {
  map,
  withLatestFrom,
  tap,
  take,
  pluck,
  filter,
  switchMap,
} from 'rxjs/operators';

import {
  Pedido,
  PedidoDet,
  PedidoParams,
  PedidoItemParams,
  TipoDePedido,
  FormaDePago,
  Cliente,
  DescuentoPorVolumen,
  PedidoSummary,
} from 'src/app/models';

import sumBy from 'lodash-es/sumBy';
import maxBy from 'lodash-es/maxBy';
import round from 'lodash-es/round';
import toNumber from 'lodash-es/toNumber';
import {
  generarCargoPorCorte,
  generarCargoPorFlete,
  generarCargoPorTarjeta,
} from '@data-access/+state/pedidos/cargo-utils';
import { DescuentosService } from '@data-access/services/descuentos.service';
import { PedidoValidators } from './validation/pedido-validators';
import { CreditoValidators } from './validation/credito.validators';

export interface PedidoControls {
  id?: AbstractControl;
  nombre: AbstractControl;
  cliente: AbstractControl;
  credito: AbstractControl;
  tipo: AbstractControl;
  formaDePago: AbstractControl;
  descuentoEspecial: AbstractControl;
}

export interface DescuentosRef {
  descuento: number;
  descuentoOriginal: number;
  descuentoEspecial: number;
  descuentoPorVolumen: number;
}

const toParams = (form: FormGroup): PedidoParams => {
  const cliente = form.value.cliente;
  return {
    tipo: form.value.tipo,
    formaDePago: form.value.formaDePago,
    cliente,
    credito: cliente ? cliente.credito : null,
    descuentoEspecial: form.value.descuentoEspecial,
    partidas: form.value.partidas,
  };
};

const toSummary = (items: PedidoDet[]): PedidoSummary => {
  const found = maxBy(items, 'descuento');
  return {
    importe: sumBy(items, 'importe'),
    descuento: found ? found.descuento : 0.0,
    descuentoImporte: sumBy(items, 'descuentoImporte'),
    subtotal: sumBy(items, 'subtotal'),
    impuesto: sumBy(items, 'impuesto'),
    total: sumBy(items, 'total'),
    kilos: sumBy(items, 'kilos'),
  };
};

@Injectable()
export class PedidoFormBuilderService {
  // Form an Form related state
  form: FormGroup = this.buildForm();
  tipo$: Observable<TipoDePedido> = this.form.get('tipo').valueChanges;
  formaDePago$ = this.form.get('formaDePago').valueChanges;
  descuentoEspecial$ = this.form.get('descuentoEspecial').valueChanges;
  controls = this.buildPedidoFormControls(this.form);

  partidas$: Observable<PedidoDet[]> = this.form.get('partidas').valueChanges;
  recalaulo$ = combineLatest([this.tipo$, this.formaDePago$]).pipe(
    map(([tipo, formaDePago]) => ({ tipo, formaDePago }))
  );

  recalcular$: Observable<PedidoParams> = merge(
    this.tipo$.pipe(map((value) => ({ tipo: value }))),
    this.formaDePago$.pipe(map((value) => ({ formaDePago: value }))),
    this.descuentoEspecial$.pipe(map((value) => ({ descuentoEspecial: value })))
  ).pipe(
    tap((value) => console.log('Changed: ', value)),
    map((source) => ({ ...toParams(this.form), ...source })),
    tap((params) => this.recalcular(params))
  );

  private params = new BehaviorSubject<PedidoParams>(toParams(this.form));
  params$ = this.params.asObservable();

  private summary = new BehaviorSubject<PedidoSummary>(toSummary([]));
  summary$ = this.summary.asObservable();

  private descuentos = new BehaviorSubject<DescuentosRef>(null);
  descuentos$ = this.descuentos.asObservable();

  proximoDescuento$ = new BehaviorSubject(null);

  pedidoChanges$ = this.form.valueChanges.pipe(
    map((data) => ({ ...data })),
    tap((data) => console.log('Current Value: ', data))
  );

  constructor(
    private fb: FormBuilder,
    private descuentoService: DescuentosService
  ) {}

  private buildForm(): FormGroup {
    return this.fb.group(
      {
        sucursal: [null, [Validators.required]],
        cliente: [null, [Validators.required]],
        credito: [null],
        nombre: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(255),
          ],
        ],
        socio: [null],
        fecha: [
          { value: new Date().toISOString(), disabled: true },
          [Validators.required],
        ],
        tipo: [null, [Validators.required]],
        formaDePago: [null, [Validators.required]],
        partidas: this.fb.array([]),
        importe: [],
        descuento: [],
        descuentoEspecial: [],
        descuentoImporte: [],
        subtotal: [],
        impuesto: [],
        total: [],
        kilos: [],
        corteImporte: [],
        cargosPorManiobra: [],
        envio: this.fb.group({}),
      },
      {
        validators: [
          PedidoValidators.ImporteMinimo,
          PedidoValidators.ImporteMaximo,
          PedidoValidators.FormaDePagoCod,
          PedidoValidators.ChequeNoPermitido,
          PedidoValidators.EnJuridico,
          PedidoValidators.ChequesDevueltos,
          PedidoValidators.SocioRequerido,
          CreditoValidators.CreditoRequired,
          CreditoValidators.PostFechadoRequerido,
          CreditoValidators.PostFechadoNoPermitido,
        ],
      }
    );
  }

  addPartidas(...items: PedidoDet[]) {
    const params = toParams(this.form);
    params.partidas = [...params.partidas, ...items];
    this.recalcular(params);
    this.form.markAsDirty();
  }

  removePartida(index: number) {
    const partidas = this.form.get('partidas') as FormArray;
    partidas.removeAt(index);
    this.recalcular(toParams(this.form));
    this.form.markAsDirty();
  }

  /**
   * Builds an object with the interface of most controls. For simplicity access
   *
   * @param form
   */
  buildPedidoFormControls(form: FormGroup): PedidoControls {
    return {
      cliente: form.get('cliente'),
      credito: form.get('credito'),
      nombre: form.get('nombre'),
      tipo: form.get('tipo'),
      formaDePago: form.get('formaDePago'),
      descuentoEspecial: form.get('descuentoEspecial'),
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

  getParams(): PedidoParams {
    return toParams(this.form);
  }

  setPedido(pedidoRaw: Pedido, emitEvent = true, onlySelf = false) {
    // Excluimos el envio y cliente del pedido
    const { envio, cliente, ...pedido } = pedidoRaw;
    this.form.patchValue(pedido, { onlySelf, emitEvent });
    this.setCliente(cliente);
  }

  setCliente(cliente: Partial<Cliente>) {
    const { credito, nombre, rfc } = cliente;
    this.form.patchValue({ cliente, nombre });
    this.controls.credito.patchValue(credito);
    this.enableNombre(rfc);
    this.params.next(toParams(this.form));
  }

  enableNombre(rfc: string) {
    const ctrl = this.controls.nombre;
    rfc === 'XAXX010101000'
      ? ctrl.enable({ onlySelf: true, emitEvent: false })
      : ctrl.disable({ onlySelf: true, emitEvent: false });
  }

  setDescuentoEspecial(value: any) {
    const descuento = toNumber(value);
    this.controls.descuentoEspecial.setValue(descuento);
  }

  recalcular(params: PedidoParams) {
    console.groupCollapsed('Recalcular pedido');

    // Actualizar el precio de las partidas
    this.actualizarPrecio(params.tipo, params.partidas);

    // Recalcular el descuento
    const descuentos = this.calcularDescuento(params);
    console.log('Descuentos', descuentos);

    // Aplicar el descuento y recalcular  partiddas
    const items = this.aplicarDescuentos(descuentos, params).map((item) =>
      this.recalculaPartida(item)
    );

    // Cargos
    this.registrarCargoPorCorte(items);
    this.registrarCargoPorTarjeta(items, params.formaDePago);
    this.registrarCargoPorFlete(items);

    const array = this.form.get('partidas') as FormArray;
    array.clear();
    items.forEach((item) => array.push(new FormControl(item)));

    // Actualizar
    const summary = toSummary(items);
    this.form.patchValue(summary);
    this.summary.next(summary);
    this.params.next(toParams(this.form));
    this.descuentos.next(descuentos);
    this.notificarProximoDescuento(params);
    console.groupEnd();
  }

  actualizarPrecio(tipo: TipoDePedido, partidas: PedidoDet[]) {
    const credito = tipo === TipoDePedido.CREDITO;
    partidas.forEach((item) => {
      const precio = credito
        ? item.producto.precioCredito
        : item.producto.precioContado;
      item.precio = precio;
    });
    return partidas;
  }

  /********** Metodos relacionados con el calculo del descuento
   *  TODO: Mover a su propio service
   **************************************************************/

  calcularDescuento(params: PedidoParams) {
    switch (params.tipo) {
      case TipoDePedido.CREDITO:
        return this.calcularDescuentoEnCredito(params);
      case TipoDePedido.CONTADO:
      case TipoDePedido.COD:
        return this.calcularDescuentoEnContado(params);
      default:
        throw new Error(
          'Imposible calcular descuento para tipo: ' + params.tipo
        );
    }
  }

  calcularDescuentoEnCredito(params: PedidoParams): DescuentosRef {
    const { cliente, credito } = params;

    const descuentoFijo = credito ? credito.descuentoFijo : 0.0;

    let descuentoPorVolumen = 0.0;
    let descuento = descuentoFijo;
    let descuentoOriginal = descuentoFijo;

    if (credito && credito.postfechado) {
      descuentoPorVolumen = this.findDescuentoPorVolumen(params) - 4;
      descuento = descuentoPorVolumen > 0 ? descuentoPorVolumen : 0.0;
      descuentoOriginal = descuentoPorVolumen;
    }

    return {
      descuento,
      descuentoEspecial: 0.0,
      descuentoOriginal,
      descuentoPorVolumen,
    };
  }

  calcularDescuentoEnContado(params: PedidoParams): DescuentosRef {
    console.log('Calculando descuento contado params:', params);
    const { descuentoEspecial = 0.0 } = params;
    const descuentoPorVolumen = this.findDescuentoPorVolumen(params);
    const descuentoOriginal = descuentoPorVolumen;
    const descuento =
      descuentoEspecial > 0 ? descuentoEspecial : descuentoPorVolumen;
    return {
      descuento,
      descuentoEspecial,
      descuentoOriginal,
      descuentoPorVolumen,
    };
  }

  getImporteBrutoParaDescuento(items: PedidoDet[]): number {
    return sumBy(
      this.depurarPartidas(items).filter((item) => item.modoVenta === 'B'),
      'importe'
    );
  }

  depurarPartidas(partidas: PedidoDet[]) {
    return partidas
      .filter((item) => !item.clave.includes('CORTE'))
      .filter((item) => item.clave !== 'MANIOBRA');
  }

  findDescuentoPorVolumen(params: PedidoParams): number {
    const monto = this.getImporteBrutoParaDescuento(params.partidas);
    /*
    const mayores = this.descuentos.filter((item) => item.importe >= monto);
    return mayores.length > 0 ? mayores[0].descuento : 0.0;
    */
    return this.descuentoService.findDescuentoPorVolumen(monto);
  }

  /******** END Methdos para descuento ********/

  aplicarDescuentos(descuentos: DescuentosRef, params: PedidoParams) {
    const { partidas } = params;
    const items = this.depurarPartidas(partidas).filter(
      (item) => item.modoVenta === 'B'
    );
    return items.map((item) => ({ ...item, ...descuentos }));
  }

  recalculaPartida(item: PedidoDet): PedidoDet {
    const { importe, descuento } = item;
    const descuentoImporte = round(importe * (descuento / 100), 2);
    const subtotal = importe - descuentoImporte;
    const impuesto = round(subtotal * 0.16, 2);
    const total = subtotal + impuesto;

    return {
      ...item,
      descuentoImporte,
      subtotal,
      impuesto,
      total,
    };
  }

  registrarCargoPorCorte(partidas: PedidoDet[]) {
    const corte = generarCargoPorCorte(partidas);
    if (corte) {
      partidas.push(corte);
      this.form.get('corteImporte').setValue(corte.importe);
    } else {
      this.form.get('corteImporte').setValue(0.0);
    }
  }

  registrarCargoPorTarjeta(partidas: PedidoDet[], formaDePago: FormaDePago) {
    if (
      formaDePago === FormaDePago.TARJETA_CRE ||
      formaDePago === FormaDePago.TARJETA_DEB
    ) {
      const item = generarCargoPorTarjeta(partidas, formaDePago);
      if (item) {
        partidas.push(item);
      }
    }
  }

  registrarCargoPorFlete(partidas: PedidoDet[]) {
    const control = this.form.get('cargosPorManiobra');
    const maniobra = control.value;
    if (maniobra) {
      const item = generarCargoPorFlete(maniobra);
      partidas.push(item);
      control.setValue(maniobra.importe);
    } else {
      control.setValue(0.0);
    }
  }

  notificarProximoDescuento(params: PedidoParams) {
    const { tipo, credito } = params;
    const isContado = tipo !== TipoDePedido.CREDITO;
    const isCredito = tipo === TipoDePedido.CREDITO;
    const isPostFechado = isCredito && credito && credito.postfechado;

    if (isCredito && !isPostFechado) {
      return null;
    }

    let cargo = isPostFechado ? 4 : 0;

    const importeBruto = this.getImporteBrutoParaDescuento(params.partidas);
    const next = this.descuentoService.findNexDescuento(importeBruto);
    if (next) {
      if (cargo > 0) {
        next.descuento = next.descuento - cargo;
      }
      this.proximoDescuento$.next(next);
    }
  }
}
