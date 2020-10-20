import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cliente, Pedido, Sucursal } from 'src/app/models';
import { PedidoFormBuilderService } from './pedido-form.builder.service';
import { buildNewPedido } from './pedido-form.utils';

@Component({
  selector: 'sxcc-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoFormComponent implements OnInit {
  @Input() pedido: Pedido;
  @Input() sucursales: Sucursal[] = [];
  @Output() save = new EventEmitter<Pedido>();
  form: FormGroup;
  constructor(private pfb: PedidoFormBuilderService) {}

  ngOnInit() {
    this.form = this.pfb.build(this.pedido);
    this.form.valueChanges.subscribe((value) => console.log('Value: ', value));
  }

  setCliente(cliente: Cliente) {
    console.log('Cliente:  ', cliente.nombre);
  }
}
