import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormaDePago, Pedido, TipoDePedido } from 'src/app/models';

@Injectable()
export class PedidoFormBuilderService {
  constructor(private fb: FormBuilder) {}

  build(pedido: Partial<Pedido>): FormGroup {
    const { cliente, nombre, fecha, tipo, formaDePago, sucursal } = pedido;
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
    });
    return f;
  }
}
