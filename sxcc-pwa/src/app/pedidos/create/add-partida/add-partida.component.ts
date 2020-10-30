import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController } from '@ionic/angular';

import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil, tap, map } from 'rxjs/operators';

import {
  Pedido,
  PedidoDet,
  PedidoItemParams,
  Producto,
  TipoDePedido,
} from 'src/app/models';
import { BaseComponent } from 'src/app/shared/common';

import { ProductoSelectorComponent } from '../../../shared/productos-selector/producto-selector.component';
import { PartidaFormService } from './partida-form.service';

@Component({
  selector: 'sxcc-add-partida',
  templateUrl: './add-partida.component.html',
  styleUrls: ['./add-partida.component.scss'],
  providers: [PartidaFormService],
})
export class AddPartidaComponent extends BaseComponent implements OnInit {
  form: FormGroup = this.formService.form;
  @Input() pedido: Pedido;
  @Input() pedidoDet: Partial<PedidoDet>;
  @Input() params: PedidoItemParams;
  @Input() lookup: (clave: string) => Producto | null;

  static MODAL_ID = 'CREATE_PARTIDA_MODAL';

  controls = {
    tantos: this.form.get('corte.tantos'),
    producto: this.form.get('producto'),
    descripcion: this.form.get('descripcion'),
    precio: this.form.get('precio'),
    cantidad: this.form.get('cantidad'),
    instruccion: this.form.get('corte.instruccion'),
    instruccionEspecial: this.form.get('corte.instruccionEspecial'),
    corte: this.form.get('corte'),
  };
  corte = this.controls.corte;
  instruccion = this.controls.instruccion;
  instruccionEspecial = this.controls.instruccionEspecial;

  producto$ = this.formService.producto$;

  @ViewChild('tantosComponent') tantosElement: IonInput;
  constructor(
    private modalController: ModalController,
    private formService: PartidaFormService
  ) {
    super();
  }

  ngOnInit() {
    this.formService.editParams$.next(this.params);
    this.addListeners();
    if (this.pedidoDet) this.form.patchValue(this.pedidoDet);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tantosElement.setFocus();
    }, 600);
  }

  private addListeners() {
    this.formService.totales$
      .pipe(takeUntil(this.destroy$))
      .subscribe((importes) => this.form.patchValue(importes));
  }

  async selectProducto() {
    const modal = await this.modalController.create({
      component: ProductoSelectorComponent,
      cssClass: 'prod-selector',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.setNewProduct(data);
    }
  }

  findProductByClave(clave: string) {
    const found = this.lookup(clave.toUpperCase());
    // this.producto$.next(found);
    this.setNewProduct(found);
  }

  private setNewProduct(prod: Partial<Producto>) {
    if (!prod) {
      this.formService.reset();
      return;
    }
    const { producto, descripcion, precio } = this.controls;
    const { precioCredito, precioContado } = prod;
    producto.setValue(prod);
    descripcion.setValue(prod.descripcion);
    precio.setValue(
      this.params.tipo === TipoDePedido.CREDITO ? precioCredito : precioContado
    );
  }

  @HostListener('keydown.f2', ['$event'])
  onHotKeyFindFactura(event: KeyboardEvent) {
    event.preventDefault();
    this.selectProducto();
  }

  onSubmit() {
    if (this.form.valid) {
      if (!this.pedido || !this.pedidoDet.id) {
        const item = this.formService.getPedidoItemData(this.params);
        this.modalController.dismiss(item, null, AddPartidaComponent.MODAL_ID);
      }
    }
  }
  cancel() {
    this.modalController.dismiss();
  }

  getTitle() {
    return this.pedido && this.pedidoDet.id
      ? `Editar partida: ${this.params.tipo.toString()}`
      : `Agregar partida: ${this.params.tipo.toString()}`;
  }
}
