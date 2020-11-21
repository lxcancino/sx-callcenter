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
import { ValidationErrors, FormGroup } from '@angular/forms';

import {
  catchError,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  Cliente,
  Pedido,
  PedidoDet,
  PedidoParams,
  PedidoSummary,
} from 'src/app/models';
import { PedidoFormBuilderService } from './pedido-form.builder.service';
import { BaseComponent } from '../common';
import { PedidoValidationComponent } from './validation/pedido-validation.component';
import { ClientesService } from '@data-access/services/clientes.service';
import { getFormValidationErrors } from '@utils';

@Component({
  selector: 'sxcc-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.scss'],
  providers: [PedidoFormBuilderService],
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
    this.connectFirebase();
  }

  connectFirebase() {
    this.formService.firebaseCliente$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ nombre, direccionesEntrega, direccion, direcciones }) => {
        // console.log('Cliente :', nombre);
        // console.log('Direccion: ', direccion);
        // console.log('Direcciones: ', direcciones);
        // console.log('Direcciones de engrega: ', direccionesEntrega);
      });
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        console.log('PedidoForm.STATUS: ', status);
        this.errors.next(this.getErrors());
      });

    this.formService.pedidoChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }

  clienteId$: BehaviorSubject<string>;
  firebaseCliente$: Observable<Cliente>;

  setCliente(cliente: Partial<Cliente>) {
    this.formService.setCliente(cliente);
    // this.clienteId$.next(cliente.id);
    this.cd.markForCheck();
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

  getErrors() {
    // const errores = Object.keys(this.form.errors || {});
    // return errores;
    return this.form.errors;
  }

  getPedidoControlsErrors() {
    const errors = getFormValidationErrors(this.form);
    return errors.map((err) => `pedido.${err.control}.${err.error}`);
  }

  getEnvioControlsErrors() {
    const eform = this.form.get('envio') as FormGroup;
    const errors = getFormValidationErrors(eform);
    return errors.map((err) => `envio.${err.control}.${err.error}`);
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
