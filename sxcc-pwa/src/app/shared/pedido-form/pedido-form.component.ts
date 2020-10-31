import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import {
  Cliente,
  Pedido,
  PedidoDet,
  PedidoImportes,
  Sucursal,
  TipoDePedido,
} from 'src/app/models';
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
  @Output() sumaryChanged = new EventEmitter<PedidoImportes>();

  form = this.formService.form;
  // form: FormGroup;
  controls = this.formService.buildPedidoFormControls(this.form);

  partidas$ = this.formService.partidas$;
  sumary$ = this.formService.sumary$;
  segment = 'partidas';

  constructor(
    private formService: PedidoFormBuilderService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.form.patchValue(this.pedido);
    this.addListeners();
  }

  addListeners() {
    // this.formService.recalaulo$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((params) => {
    //     console.log('Recalcular con parametros: ', params);
    //   });

    this.formService.params$
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        // console.log('Recalcular con parametros: ', params);
      });
    this.formService.descuento$.subscribe((descuento) =>
      console.log('Descuento calcularo: ', descuento)
    );
    this.sumary$
      .pipe(takeUntil(this.destroy$))
      .subscribe((totales) => this.sumaryChanged.emit(totales));

    // this.partidas$.subscribe((items) => console.log('Items: ', items));
  }

  setCliente(cliente: Cliente) {
    console.log('Cliente:  ', cliente.nombre);
    this.controls.cliente.setValue(cliente);
    this.controls.nombre.setValue(cliente.nombre);
  }

  getEditItemParams() {
    return this.formService.getEditParams(this.form);
  }

  segmentChanged({ detail: { value } }) {
    this.segment = value;
    this.cd.markForCheck();
  }

  addPartida(item: PedidoDet) {
    this.formService.addPartidas(item);
  }
}
