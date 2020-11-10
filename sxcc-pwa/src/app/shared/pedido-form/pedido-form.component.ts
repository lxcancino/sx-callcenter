import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

import {
  Cliente,
  DescuentoPorVolumen,
  Pedido,
  PedidoDet,
  PedidoParams,
  PedidoSummary,
  Sucursal,
  TipoDePedido,
} from 'src/app/models';
import {
  PedidoControls,
  PedidoFormBuilderService,
} from './pedido-form.builder.service';
import { BaseComponent } from '../common';
import { startWith, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { PedidoValidationComponent } from './validation/pedido-validation.component';
import { getClienteMostrador } from '@data-access/+state/pedidos/pedido.utils';

@Component({
  selector: 'sxcc-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoFormComponent extends BaseComponent implements OnInit {
  @Input() pedido: Pedido;

  @Output() save = new EventEmitter<Pedido>();
  @Output() sumaryChanged = new EventEmitter<PedidoSummary>();
  @Output() paramsChanged = new EventEmitter<PedidoParams>();
  @Output() descuentoAlert = new EventEmitter<any>();
  @Output() errors = new EventEmitter<ValidationErrors | null>();

  form = this.formService.form;

  // form: FormGroup;
  controls = this.formService.buildPedidoFormControls(this.form);

  partidas$ = this.formService.partidas$;
  summary$ = this.formService.summary$;

  segment = 'partidas';

  @ViewChild(PedidoValidationComponent)
  validationComponent: PedidoValidationComponent;

  constructor(
    private formService: PedidoFormBuilderService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.formService.setPedido(this.pedido, false);
    this.form.markAsPristine();
    this.addListeners();
  }

  addListeners() {
    this.formService.recalcular$
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {});

    this.formService.params$
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => this.paramsChanged.emit(params));

    this.formService.summary$
      .pipe(takeUntil(this.destroy$))
      .subscribe((summary) => this.sumaryChanged.emit(summary));

    this.formService.proximoDescuento$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          const { faltantePorcentual } = data;
          if (faltantePorcentual < 10) {
            this.descuentoAlert.emit(data);
          }
        }
      });

    // Errors notification
    this.form.statusChanges
      .pipe(takeUntil(this.destroy$), startWith('VALID'))
      .subscribe((status) => {
        this.errors.next(this.form.errors);
      });

    this.formService.pedidoChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }

  setCliente(cliente: Partial<Cliente>) {
    this.formService.setCliente(cliente);
  }

  setDescuentoEspecial(descuento: number) {
    this.formService.setDescuentoEspecial(descuento);
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

  removePartida(index: number) {
    this.formService.removePartida(index);
  }

  submit() {
    console.log('PedidoId: ', this.pedido.id);
    console.log('Changes: ', this.form.getRawValue());
  }

  /**
   *
   */
  showValidation() {
    this.validationComponent.setVisible();
  }

  get params$() {
    return this.formService.params$;
  }

  get valid() {
    return this.form.valid;
  }

  get pristine() {
    return this.form.pristine;
  }

  get canSave() {
    return this.form.pristine;
  }
}
