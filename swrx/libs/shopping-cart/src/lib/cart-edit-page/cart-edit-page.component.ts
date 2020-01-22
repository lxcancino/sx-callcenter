import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  HostListener
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CartFacade } from '../+state/cart.facade';
import { ClientesFacade } from '@swrx/clientes';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CartSumary } from '../+state/cart.models';
import {
  Pedido,
  Cliente,
  FormaDePago,
  TipoDePedido,
  Socio
} from '@swrx/core-model';

import { AngularFireAuth } from '@angular/fire/auth';

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
  user: any;

  constructor(
    private fb: FormBuilder,
    public facade: CartFacade,
    private firebaseAuth: AngularFireAuth,
    private clientes: ClientesFacade
  ) {}

  ngOnInit() {
    this.buildForm();
    this.addListeners();
    this.pedido$ = this.facade.currentPedido;
    this.pedido$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value) {
        this.cartForm.patchValue(value, { emitEvent: false });
      }
    });
    this.firebaseAuth.user.pipe(takeUntil(this.destroy$)).subscribe(usr => {
      const { displayName, email } = usr;
      this.user = { displayName, email };
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.cartForm = this.fb.group(
      {
        sucursal: [null],
        tipo: [null, [Validators.required]],
        formaDePago: [null, [Validators.required]],
        usoDeCfdi: [null, [Validators.required]],
        cfdiMail: [null],
        comprador: [null],
        comentario: [null]
      },
      { updateOn: 'blur' }
    );
  }

  private addListeners() {
    this.addFormaDePagoListener();
    this.addTipoDePedidoListener();
    this.addUsoDeCfdiListener();
    this.addCfdiMailListener();
    this.addSucursallListener();
    this.addClienteListener();
    this.addCompradorListener();
    this.addComemtarioListener();
    this.facade.dirty$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cartForm.markAsDirty());
  }

  private addFormaDePagoListener() {
    this.cartForm
      .get('formaDePago')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(formaDePago => {
        this.facade.cambiarFormaDePago(formaDePago);
        if (formaDePago === FormaDePago.CHEQUE_PSTF) {
          this.cartForm.get('tipo').setValue(TipoDePedido.CREDITO);
          // this.cartForm.get('tipo').disable();
        } else {
          // this.cartForm.get('tipo').enable();
        }
      });
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
  private addSucursallListener() {
    this.cartForm
      .get('sucursal')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(sucursal => this.facade.cambiarSucursal(sucursal));
  }

  private addCompradorListener() {
    this.cartForm
      .get('comprador')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(comprador => this.facade.cambiarComprador(comprador));
  }
  private addComemtarioListener() {
    this.cartForm
      .get('comentario')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(comentario => this.facade.cambiarComentario(comentario));
  }

  private addClienteListener() {
    this.facade.cliente$.pipe(takeUntil(this.destroy$)).subscribe(cte => {
      if (cte.credito) {
        if (cte.credito.postfechado) {
          // this.cartForm.get('formaDePago').setValue(FormaDePago.CHEQUE_PSTF);
          // this.cartForm.get('tipo').setValue(TipoDePedido.CREDITO);
          // this.cartForm.get('tipo').disable();
        } else {
          // this.cartForm.get('formaDePago').setValue(FormaDePago.CHEQUE);
          // this.cartForm.get('formaDePago').enable();
        }

        this.cartForm.get('usoDeCfdi').setValue(cte.credito.usoDeCfdi || 'G01');
      }

      this.cartForm.get('cfdiMail').setValue(cte.cfdiMail);
    });
  }

  addCartItem() {
    this.facade.addCartItem();
  }

  cambiarCliente() {
    this.facade.cambiarCliente();
  }

  onCheckout() {
    if (this.user) {
      this.facade.startCheckout(this.user);
    }
  }
  onCambiarNombre(cliente: Partial<Cliente>) {
    if (cliente.rfc === 'XAXX010101000') {
      this.facade.cambiarNombre();
    }
  }

  showDescuentos() {
    this.facade.mostrarDescuentos();
  }

  cerrarPedido(pedido: Pedido) {
    this.facade.cerrarPedido(pedido);
  }

  goToNewCart() {
    this.facade.cleanShoppingCartState();
  }

  @HostListener('document:keydown.meta.i', ['$event'])
  onHotKeyInsert(event) {
    this.addCartItem();
  }
  @HostListener('document:keydown.insert', ['$event'])
  onHotKeyInsert2(event) {
    this.addCartItem();
  }
  /** Show descuentos */
  @HostListener('document:keydown.control.d', ['$event'])
  onHotKeyShowDescuentos(event) {
    this.showDescuentos();
  }

  isDisabled(pedido: Partial<Pedido>, hasErrors: boolean) {
    if (pedido.status === 'CERRADO') {
      return true;
    } else if (hasErrors) {
      return true;
    } else {
      return this.cartForm.invalid || this.cartForm.pristine;
    }
  }

  /** Show descuentos */
  @HostListener('document:keydown.control.c', ['$event'])
  onHotKeyAltaDeCliente(event) {
    this.clienteNuevo();
  }

  clienteNuevo() {
    if (this.user) {
      this.clientes.createCliente(this.user);
    }
  }
  onSocio(event: Socio) {
    this.facade.asignarSocio(event);
  }

  onDescuentoEspecial() {
    this.facade.asignarDescuentoEspecial();
  }

  onAutorizar(pedido: Partial<Pedido>, event: any) {
    if (this.user) {
      this.facade.autorizarPedido(pedido, this.user, event);
    }
  }
}
