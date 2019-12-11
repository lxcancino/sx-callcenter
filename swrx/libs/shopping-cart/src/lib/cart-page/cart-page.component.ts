import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CartFacade } from '../+state/cart.facade';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CartSumary } from '../+state/cart.models';
import { TipoDePedido, FormaDePago } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartForm: FormGroup;
  sumary$: Observable<CartSumary> = this.facade.sumary$;
  destroy$ = new Subject<boolean>();

  constructor(private fb: FormBuilder, public facade: CartFacade) {}

  ngOnInit() {
    this.buildForm();
    this.addListeners();
    // this.facade.cartStateForm$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(state => {
    //     console.log('Initial form state: ', state);
    //   });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.cartForm = this.fb.group({
      tipo: [TipoDePedido.CONTADO, [Validators.required]],
      formaDePago: ['EFECTIVO', [Validators.required]],
      usoDeCfdi: ['G01', [Validators.required]]
    });
  }

  private addListeners() {
    this.addFormaDePagoListener();
    this.addTipoDePedidoListener();
    this.addUsoDeCfdiListener();
  }

  private addFormaDePagoListener() {
    this.cartForm
      .get('formaDePago')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(formaDePago => this.facade.cambiarFormaDePago(formaDePago));
  }

  private addTipoDePedidoListener() {
    this.cartForm
      .get('tipo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(tipo => this.facade.cambiarTipo(tipo));
  }

  private addUsoDeCfdiListener() {
    this.cartForm
      .get('usoDeCfdi')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(clave => this.facade.cambiarUso(clave));
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
