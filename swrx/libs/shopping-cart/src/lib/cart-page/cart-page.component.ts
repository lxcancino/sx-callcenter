import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CartFacade } from '../+state/cart.facade';

import { Observable } from 'rxjs';
import { CartSumary } from '../+state/cart.models';

@Component({
  selector: 'swrx-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit {
  cartForm: FormGroup;
  sumary$: Observable<CartSumary> = this.facade.sumary$;

  constructor(private fb: FormBuilder, public facade: CartFacade) {}

  ngOnInit() {
    this.buildForm();
    this.addListeners();
  }

  private buildForm() {
    this.cartForm = this.fb.group({
      // cliente: [null, Validators.required],
      // nombre: [null, [Validators.required]],
      // rfc: [null, [Validators.required]],
      tipo: ['CONTADO', [Validators.required]],
      formaDePago: ['EFECTIVO', [Validators.required]],
      usoDeCfdi: ['G01', [Validators.required]]
      // importe: [0.0, [Validators.required]],
      // descuento: [0.0, [Validators.required]],
      // descuentoImporte: [0.0, [Validators.required]],
      // subtotal: [0.0, [Validators.required]],
      // impuesto: [0.0, [Validators.required]],
      // total: [0.0, [Validators.required]]
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

  addCartItem() {
    this.facade.addCartItem();
  }

  cambiarCliente() {
    this.facade.cambiarCliente();
  }

  onCheckout() {
    this.facade.startCheckout();
  }
}
