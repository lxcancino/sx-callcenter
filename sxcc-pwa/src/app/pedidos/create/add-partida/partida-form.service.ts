import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  PedidoItemParams,
  Producto,
  TipoDePedido,
  PedidoImportes,
  PedidoDet,
  Corte,
} from '@models';

import { Observable, combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import round from 'lodash-es/round';

const corteValidator: ValidatorFn = (corteForm: FormGroup) => {
  const tantos = corteForm.get('tantos').value;
  if (tantos > 0) {
    const {
      instruccion,
      cantidad,
      precio,
      instruccionEspecial,
    } = corteForm.value;
    if (!instruccion) {
      return {
        instruccionRequerida: true,
        message: 'Se requiere la instrucción',
      };
    } else if (instruccion === 'ESPECIAL' && !instruccionEspecial) {
      return {
        instruccionEspecialRequerida: true,
        message: 'Se requiere la descripción del corte especial',
      };
    } else if (cantidad <= 0) {
      return {
        cantidadDeCortesRequerida: true,
        message: 'Se requiere el # de cortes',
      };
    }
  }
  return null;
};

@Injectable()
export class PartidaFormService {
  form = this.buildForm();
  cantidad$ = this.form.get('cantidad').valueChanges;
  producto$ = this.form.get('producto').valueChanges;
  liveProducto$ = new BehaviorSubject<Producto>(null);
  editParams$ = new BehaviorSubject<PedidoItemParams>(null);
  totales$: Observable<PedidoImportes> = combineLatest([
    this.producto$,
    this.cantidad$,
    this.editParams$,
  ]).pipe(
    map(([producto, cantidad, params]) =>
      this.calcularImportes(producto, cantidad, params)
    )
  );

  constructor(private fb: FormBuilder) {}

  private buildForm(): FormGroup {
    const form = this.fb.group({
      // tantos: [{ value: null }],
      producto: [null, [Validators.required]],
      descripcion: [{ value: null, disabled: true }],
      cantidad: [
        { value: 0.0, disabled: false },
        { validators: [Validators.required, Validators.min(1)] },
      ],
      precio: [
        { value: null, disabled: true },
        [Validators.required, Validators.min(1.0)],
      ],
      importeBruto: [{ value: 0.0, disabled: true }],
      descuento: [{ value: 0.0, disabled: true }],
      descuentoEspecial: [{ value: 0.0, disabled: true }],
      descuentoImporte: [{ value: 0.0, disabled: true }],
      subtotal: [{ value: 0.0, disabled: true }],
      impuesto: [{ value: 0.0, disabled: true }],
      total: [{ value: 0.0, disabled: true }],
      comentario: [''],
      corte: this.fb.group(
        {
          tantos: [{ value: null }],
          instruccion: [null],
          instruccionEspecial: [{ value: null, disabled: true }],
          cantidad: [0],
          precio: [10.0],
          refinado: false,
          limpio: false,
        },
        { validators: [corteValidator] }
      ),
    });
    return form;
  }

  private calcularImportes(
    producto: Producto,
    cantidad: number,
    params: PedidoItemParams
  ): PedidoImportes {
    if (!producto) {
      return {
        importeBruto: 0,
        descuento: 0,
        descuentoImporte: 0,
        subtotal: 0,
        impuesto: 0,
        total: 0,
      };
    }
    const { tipo, descuento, descuentoEspecial } = params;
    const { precioCredito, precioContado, unidad, modoVenta } = producto;
    const factor = unidad === 'MIL' ? 1 / 1000 : 1;
    const precio =
      tipo === TipoDePedido.CREDITO ? precioCredito : precioContado;
    const importeBruto = round(cantidad * factor * precio);
    const descuentoFinal =
      modoVenta === 'N'
        ? 0.0
        : descuentoEspecial > 0
        ? descuentoEspecial
        : descuento;
    const descuentoImporte = round(importeBruto * (descuentoFinal / 100), 2);
    const subtotal = importeBruto - descuentoImporte;
    const impuesto = round(subtotal * 0.16, 2);
    const total = subtotal + impuesto;
    return {
      importeBruto,
      descuento,
      descuentoImporte,
      subtotal,
      impuesto,
      total,
    };
  }

  calcularKilos(cantidad: number, producto: Producto) {
    const factor = producto.unidad === 'MIL' ? 1 / 1000 : 1;
    const kilos = cantidad * factor * producto.kilos;
    return round(kilos, 3);
  }

  reset(): void {
    this.form.reset(this.getEmpty(), { onlySelf: true, emitEvent: false });
  }

  getEmpty() {
    return {
      producto: null,
      descripcion: [{ value: null, disabled: true }],
      cantidad: 0,
      precio: 0,
      importeBruto: 0,
      descuento: 0,
      descuentoEspecial: 0,
      descuentoImporte: 0,
      subtotal: 0,
      impuesto: 0,
      total: 0,
      corte: {
        tantos: null,
        instruccion: null,
        instruccionEspecial: null,
        cantidad: 0,
        precio: 10,
        refinado: false,
        limpio: false,
      },
    };
  }

  getPedidoItemData(params: PedidoItemParams): Partial<PedidoDet> {
    const formData: any = this.form.getRawValue();
    const producto: Producto = formData.producto;
    const cantidad: number = formData.cantidad;

    const produtoData = this.getProductoData(producto);
    const item: PedidoDet = {
      ...formData,
      ...produtoData,
      cantidad,
      kilos: this.calcularKilos(cantidad, producto),
      precioOriginal:
        params.tipo === TipoDePedido.CREDITO
          ? producto.precioCredito
          : producto.precioContado,
    };

    const corteForm = this.form.get('corte') as FormGroup;
    const corteData = corteForm.value;

    if (corteData.tantos > 0) {
      const corte: Corte = { ...corteData };
      if (corte.instruccion !== 'ESPECIAL') {
        corte.instruccionEspecial = null;
      }
      item.corte = corte;
      item.importeCortes = round(corte.cantidad * corte.precio, 2);
    }
    return item;
  }

  getProductoData(producto: Producto) {
    const {
      clave,
      descripcion,
      unidad,
      presentacion,
      gramos,
      nacional,
      modoVenta,
    } = producto;
    return {
      producto,
      clave,
      descripcion,
      unidad,
      presentacion,
      gramos,
      nacional,
      modoVenta,
    };
  }
}
