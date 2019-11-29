import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';

import { CartFacade } from '../+state/cart.facade';

import sumBy from 'lodash/sumBy';

@Component({
  selector: 'swrx-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit {
  cartForm: FormGroup;

  constructor(private fb: FormBuilder, private facade: CartFacade) {}

  ngOnInit() {
    this.buildForm();
    this.addListeners();
  }

  private buildForm() {
    this.cartForm = this.fb.group({
      cliente: [null, Validators.required],
      nombre: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      formaDePago: [null, [Validators.required]],
      usoDeCfdi: [null, [Validators.required]],
      importe: [0.0, [Validators.required]],
      descuento: [0.0, [Validators.required]],
      descuentoImporte: [0.0, [Validators.required]],
      subtotal: [0.0, [Validators.required]],
      impuesto: [0.0, [Validators.required]],
      total: [0.0, [Validators.required]],
      partidas: this.fb.array([])
    });
  }

  private addListeners() {
    this.addFormaDePagoListener();
    this.addTipoDeVentaListener();
    // this.partidas.valueChanges.subscribe(value =>
    //   console.log('Partidas: ', value)
    // );
  }

  private addFormaDePagoListener() {
    this.cartForm
      .get('formaDePago')
      .valueChanges.subscribe(fp => console.log('F.P: ', fp));
  }
  private addTipoDeVentaListener() {
    this.cartForm
      .get('tipo')
      .valueChanges.subscribe(fp => console.log('Tipo: ', fp));
  }

  getPartidas() {
    return this.cartForm.get('partidas') as FormArray;
  }

  onAddCartItem() {
    this.facade.addCartItem().subscribe(item => {
      this.getPartidas().push(new FormControl(item));
      this.actualizarTotales();
    });
  }

  private actualizarTotales() {
    const items = this.getPartidas().value;
    const importe = sumBy(items, 'importe');
    const descuento = sumBy(items, 'descuento');
    const subtotal = sumBy(items, 'subtotal');
    const impuesto = sumBy(items, 'impuesto');
    const total = sumBy(items, 'total');
    const part = { importe, descuento, subtotal, impuesto, total };
    this.cartForm.patchValue(part);
    // this.cartForm.get('importe').setValue(importe);
  }
}
