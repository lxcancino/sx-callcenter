import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subject, Observable } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';

import round from 'lodash/round';

import { PedidoDet, Corte, TipoDePedido } from '@swrx/core-model';
import { buildCartItem } from '../+state/cart.utils';
import { CartItem } from '../+state/cart.models';

@Component({
  selector: 'swrx-cart-add-item',
  templateUrl: './cart-add-item.component.html',
  styleUrls: ['./cart-add-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartAddItemComponent implements OnInit, OnDestroy {
  item: CartItem;
  form: FormGroup;
  tipo: TipoDePedido;
  destroy$ = new Subject<boolean>();
  filteredOptions: Observable<string[]>;

  tiposDeCorte = [
    'CARTA',
    'CALCULADO',
    'CROQUIS',
    'CRUZ',
    'DOBLE_CARTA',
    'MEDIA_CARTA',
    'MITAD',
    'OFICIO',
    '1/8'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialoRef: MatDialogRef<CartAddItemComponent>,
    private fb: FormBuilder
  ) {
    this.tipo = data.tipo;
    this.item = data.item || null;
  }

  ngOnInit() {
    this.buildForm();
    if (this.item) {
      const { producto, cantidad, precio, subtotal, corte } = this.item;
      const pat = { producto, cantidad, precio, subtotal };
      this.form.patchValue(pat);
      if (corte) {
        this.form.get('corte').patchValue(corte);
      }
    }
    this.filteredOptions = this.form
      .get('corte')
      .get('instruccion')
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.addListeners();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = this.fb.group({
      producto: [null, Validators.required],
      cantidad: [0.0, [Validators.required, Validators.min(1)]],
      precio: [0.0, Validators.required],
      subtotal: [0.0, Validators.required],
      corte: this.fb.group({
        instruccion: [null],
        cantidad: [0],
        tantos: [null],
        precio: [0.0],
        refinado: false,
        limpio: false
      })
    });
  }

  private addListeners() {
    this.addProductoListener();
    this.addCantidadListener();
  }

  private addProductoListener() {
    this.form
      .get('producto')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(prod => {
        if (this.tipo === TipoDePedido.CREDITO) {
          this.form.get('precio').setValue(prod.precioCredito);
        } else {
          this.form.get('precio').setValue(prod.precioContado);
        }
      });
  }

  private addCantidadListener() {
    this.form
      .get('cantidad')
      .valueChanges.pipe(
        map(can => {
          if (this.producto && this.producto.unidad === 'MIL') {
            return can / 1000;
          } else {
            return can;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(cantidad => this.actualizarImporte(cantidad));
  }

  private actualizarImporte(cantidad: number) {
    const precio = this.precio;
    const bruto = cantidad * precio;
    const subtotal = round(bruto, 2);
    this.form.get('subtotal').setValue(subtotal);
  }

  onSubmit() {
    if (this.form.valid) {
      const { producto, cantidad, precio, corte } = this;
      const emptyItem = this.item ? this.item : buildCartItem(producto);

      const item: PedidoDet = {
        ...emptyItem,
        cantidad,
        precio,
        corte
      };
      this.dialoRef.close(item);
    }
  }

  get producto() {
    return this.getValue('producto');
  }

  get cantidad() {
    return this.form.get('cantidad').value;
  }
  get precio() {
    return this.form.get('precio').value;
  }

  get subtotal() {
    return this.form.get('subtotal').value;
  }
  get corte(): Corte {
    const corte = this.form.get('corte').value;
    if (corte.cantidad > 0) {
      const { cantidad, precio, instruccion } = corte;
      corte.importe = cantidad * precio;
      corte.instruccion = instruccion.toUpperCase(); // small fix por que swrxUpperCase tiene un Bug
      return corte;
    } else {
      return null;
    }
  }

  private getValue(prop: string) {
    return this.form.get(prop).value;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tiposDeCorte.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
