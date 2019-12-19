import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  HostListener
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CartFacade } from '../+state/cart.facade';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CartSumary } from '../+state/cart.models';
import { Pedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-edit-page',
  templateUrl: './cart-edit-page.component.html',
  styleUrls: ['./cart-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartEditPageComponent implements OnInit, OnDestroy {
  pedido$: Observable<Pedido>;
  cartForm: FormGroup;
  sumary$: Observable<CartSumary> = this.facade.sumary$;
  destroy$ = new Subject<boolean>();

  constructor(private fb: FormBuilder, public facade: CartFacade) {}

  ngOnInit() {
    this.buildForm();
    this.addListeners();
    this.pedido$ = this.facade.currentPedido;
    this.pedido$.subscribe(p => console.log('Editando: ', p));
    this.pedido$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value) {
        this.cartForm.patchValue(value, { emitEvent: false });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.cartForm = this.fb.group({
      sucursal: [null],
      tipo: [null, [Validators.required]],
      formaDePago: [null, [Validators.required]],
      usoDeCfdi: [null, [Validators.required]],
      cfdiMail: [null]
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

  @HostListener('document:keydown.meta.i', ['$event'])
  onHotKeyInsert(event) {
    this.addCartItem();
  }
  @HostListener('document:keydown.insert', ['$event'])
  onHotKeyInsert2(event) {
    this.addCartItem();
  }
}
