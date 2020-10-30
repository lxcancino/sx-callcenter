import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Pedido, PedidoDet, PedidoItemParams } from 'src/app/models';

export interface PedidoControls {
  id?: AbstractControl;
  nombre: AbstractControl;
  cliente: AbstractControl;
  tipo: AbstractControl;
  formaDePago: AbstractControl;
}

@Injectable()
export class PedidoFormBuilderService {
  constructor(private fb: FormBuilder) {}

  build(pedido: Partial<Pedido>): FormGroup {
    const {
      cliente,
      nombre,
      fecha,
      tipo,
      formaDePago,
      sucursal,
      descuentoEspecial,
    } = pedido;
    const f = this.fb.group({
      sucursal: [sucursal, [Validators.required]],
      cliente: [cliente, [Validators.required]],
      nombre: [
        nombre,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255),
        ],
      ],
      fecha: [{ value: fecha, disabled: true }, [Validators.required]],
      tipo: [tipo, [Validators.required]],
      formaDePago: [formaDePago, [Validators.required]],
      descuentoEspecial: [descuentoEspecial],
      partidas: this.fb.array([]),
    });
    // this.buildPartidas(f, pedido);
    return f;
  }

  buildPartidas(form: FormGroup, pedido: Partial<Pedido>) {
    const partidas = form.get('partidas') as FormArray;
    pedido.partidas.forEach((item) => partidas.push(new FormControl(item)));
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
}
