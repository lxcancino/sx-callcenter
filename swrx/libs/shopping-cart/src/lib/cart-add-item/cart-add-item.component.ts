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
import { PedidoDet } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-add-item',
  templateUrl: './cart-add-item.component.html',
  styleUrls: ['./cart-add-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartAddItemComponent implements OnInit, OnDestroy {
  item: any;
  form: FormGroup;
  credito: boolean;
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
    this.credito = data.credito || false;
    this.buildForm();
  }

  ngOnInit() {
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
      cantidad: [0.0, Validators.required],
      precio: [0.0, Validators.required],
      importe: [0.0, Validators.required],
      corte: this.fb.group({
        instruccion: [null],
        cantidad: [0],
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
        if (this.credito) {
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
      .subscribe(cantidad => this.actualizarTotal(cantidad));
  }

  private actualizarTotal(cantidad) {
    const precio = this.precio;
    const bruto = cantidad * precio;
    const importe = round(bruto, 2);
    this.form.get('importe').setValue(importe);
  }

  onSubmit() {
    if (this.form.valid) {
      const producto = this.producto;
      const {
        clave,
        descripcion,
        kilos,
        gramos,
        unidad,
        modoVenta,
        presentacion,
        precioCredito,
        precioContado
      } = producto;
      const entity: PedidoDet = {
        ...this.form.value,
        producto: {
          id: producto.id,
          clave,
          descripcion,
          modoVenta,
          imageUrl: 'assets/images/1273567240.jpg'
        },
        clave,
        descripcion,
        kilos,
        gramos,
        unidad,
        modoVenta,
        precioCredito,
        precioContado,
        descuento: 0.0,
        descuentoImporte: 0.0,
        subtotal: 0.0,
        impuesto: 0.0,
        total: 0.0
      };
      this.dialoRef.close(entity);
    }
  }
  get producto() {
    return this.getValue('producto');
  }

  get precio() {
    return this.form.get('precio').value;
  }

  get importe() {
    return this.form.get('importe').value;
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
