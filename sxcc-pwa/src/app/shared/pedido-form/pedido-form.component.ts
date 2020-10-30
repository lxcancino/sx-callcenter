import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { Cliente, Pedido, Sucursal, TipoDePedido } from 'src/app/models';
import {
  PedidoControls,
  PedidoFormBuilderService,
} from './pedido-form.builder.service';
import { BaseComponent } from '../common';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'sxcc-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoFormComponent extends BaseComponent implements OnInit {
  @Input() pedido: Pedido;
  @Input() sucursales: Sucursal[] = [];
  @Output() save = new EventEmitter<Pedido>();
  form: FormGroup;

  controls: PedidoControls;
  tipo$: Observable<TipoDePedido>;

  constructor(private pfb: PedidoFormBuilderService) {
    super();
  }

  ngOnInit() {
    console.group(`${this.pedido.id ? 'Editando pedido:' : 'Pedido nuevo:'}`);
    console.log(this.pedido);
    console.groupEnd();

    this.form = this.pfb.build(this.pedido);
    this.controls = this.pfb.buildPedidoFormControls(this.form);
    this.tipo$ = this.controls.tipo.valueChanges;

    this.addListeners();
  }

  addListeners() {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => console.log('Value: ', value));
  }

  setCliente(cliente: Cliente) {
    console.log('Cliente:  ', cliente.nombre);
    this.controls.cliente.setValue(cliente);
    this.controls.nombre.setValue(cliente.nombre);
  }

  getEditItemParams() {
    return this.pfb.getEditParams(this.form);
  }

  segmentChanged(event: any) {}
}
