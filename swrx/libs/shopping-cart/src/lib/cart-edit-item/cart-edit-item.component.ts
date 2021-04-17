import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subject, Observable } from 'rxjs';
import { takeUntil, map, startWith, tap } from 'rxjs/operators';

import round from 'lodash/round';

import { Corte, TipoDePedido, Producto } from '@swrx/core-model';
import { CartItem } from '../+state/cart.models';

/**
 * Descontinuado USAR CartItemForm
 *
 */
@Component({
  selector: 'swrx-cart-edit-item',
  templateUrl: './cart-edit-item.component.html',
  styleUrls: ['./cart-edit-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartEditItemComponent implements OnInit, OnDestroy {
  item: CartItem;
  form: FormGroup;
  corteForm: FormGroup;
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
    private dialoRef: MatDialogRef<CartEditItemComponent, CartItem>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.tipo = data.tipo;
    this.item = { ...data.item };
    console.log('Editando CartItem: ', this.item);
    this.buildForm();
    this.buildCorteForm();
    this.form.patchValue(this.item);
    if (this.item.corte) {
      this.corteForm.patchValue(this.item.corte);
    }
  }

  ngOnInit() {
    this.filteredOptions = this.corteForm.get('instruccion').valueChanges.pipe(
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
      cantidad: [0, [Validators.required, Validators.min(1)]],
      precio: [null, [Validators.required, Validators.min(1)]],
      importe: [null]
    });
  }

  private buildCorteForm() {
    this.corteForm = this.fb.group({
      tantos: [null],
      instruccion: [null, [Validators.required]],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      precio: [15.0, [Validators.required, Validators.min(1)]],
      importe: [null, [Validators.required, Validators.min(1)]],
      refinado: false,
      limpio: false
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
        console.log('Producto : ', prod);
        if (prod) {
          this.updateProductoProperties(prod);
        }
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
    const importe = round(bruto, 2);
    this.form.get('importe').setValue(importe);
  }

  onSubmit() {
    if (this.form.valid) {
      const { producto, cantidad, precio } = this;
      const changes: CartItem = {
        ...this.item,
        producto,
        cantidad,
        precio,
        corte: this.corte
      };
      this.dialoRef.close(changes);
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

  get importe() {
    return this.form.get('importe').value;
  }
  get corte(): Corte {
    if (this.corteForm.valid) {
      const corte = this.corteForm.value;
      const instruccion = corte.instruccion.toUpperCase(); // small fix por que swrxUpperCase tiene un Bug
      return {
        ...corte,
        instruccion
      };
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

  private updateProductoProperties(prod: Partial<Producto>) {
    if (this.item) {
      const {
        clave,
        descripcion,
        kilos,
        gramos,
        unidad,
        modoVenta,
        presentacion,
        nacional
      } = prod;
      this.item = {
        ...this.item,
        clave,
        descripcion,
        kilos,
        gramos,
        unidad,
        modoVenta,
        presentacion,
        nacional
      };
      this.cd.markForCheck();
    }
  }
}
