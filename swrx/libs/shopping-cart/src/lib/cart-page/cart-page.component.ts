import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CartFacade } from '../+state/cart.facade';

import { Observable } from 'rxjs';
import { CartSumary } from '../+state/cart.models';
import { TipoDePedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartForm: FormGroup;
  sumary$: Observable<CartSumary> = this.facade.sumary$;

  constructor(private fb: FormBuilder, public facade: CartFacade) {}

  ngOnInit() {
    this.buildForm();
    this.addListeners();
  }

  ngOnDestroy() {}

  private buildForm() {
    this.cartForm = this.fb.group({
      tipo: [TipoDePedido.CONTADO, [Validators.required]],
      formaDePago: ['EFECTIVO', [Validators.required]],
      usoDeCfdi: ['G01', [Validators.required]]
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
      .valueChanges.subscribe(tipo => this.facade.cambiarTipo(tipo));
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
