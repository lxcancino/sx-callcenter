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
    this.facade.cliente$.pipe(takeUntil(this.destroy$)).subscribe(cte => {
      if (cte.credito) {
        if (cte.credito.postfechado) {
          this.cartForm.get('formaDePago').setValue(FormaDePago.CHEQUE_PSTF);
          this.cartForm.get('formaDePago').disable();
        } else {
          this.cartForm.get('formaDePago').setValue(FormaDePago.CHEQUE);
          this.cartForm.get('formaDePago').enable();
        }
      }
      this.cartForm.get('cfdiMail').setValue(cte.cfdiMail);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.cartForm = this.fb.group({
      tipo: [TipoDePedido.CONTADO, [Validators.required]],
      formaDePago: ['EFECTIVO', [Validators.required]],
      usoDeCfdi: ['G01', [Validators.required]],
      cfdiMail: [null, [Validators.email]]
    });
  }

  private addListeners() {
    this.addFormaDePagoListener();
    this.addTipoDePedidoListener();
    this.addUsoDeCfdiListener();
    this.addCfdiMailListener();
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

  private addCfdiMailListener() {
    this.cartForm
      .get('cfdiMail')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(email => this.facade.cambiarMail(email));
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
