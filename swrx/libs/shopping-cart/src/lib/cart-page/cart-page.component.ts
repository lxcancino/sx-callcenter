import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DEMO } from './demo-cart';
import { CartFacade } from '../+state/cart.facade';

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
    this.cartForm.patchValue(DEMO);
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

  onAddCartItem() {
    this.facade.addCartItem().subscribe(item => {
      console.log('Add ITEM: ', item);
    });
  }
}
