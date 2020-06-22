import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';

import { Producto } from '@swrx/core-model';
import { ExistenciasService, ExistenciasEntity } from '@swrx/existencias';

import { Subscription } from 'rxjs';

import sumBy from 'lodash/sumBy';

@Component({
  selector: 'swrx-cart-existencias',
  templateUrl: './cart-existencias.component.html',
  styleUrls: ['./cart-existencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartExistenciasComponent implements OnInit, OnDestroy {
  private _producto: Partial<Producto>;
  existencias: any[] = [];
  subscription: Subscription;
  @Output() disponible = new EventEmitter<number>();
  @Input() sucursal: string;
  constructor(
    private service: ExistenciasService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Sucursal: ', this.sucursal);
    if (this.sucursal === 'CALLE4') {
      this.sucursal = 'CALLE 4';
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get disponibilidad() {
    if (!this.existencias || this.existencias.length === 0) {
      return 0;
    } else {
      return sumBy(this.existencias, 'cantidad');
    }
  }

  get producto() {
    return this._producto;
  }

  @Input()
  set producto(p: Partial<Producto>) {
    if (p) {
      this.loadExistencias(p.id);
    }
    this._producto = p;
  }

  private loadExistencias(id: string) {
    this.subscription = this.service.findExistencias(id).subscribe(res => {
      this.existencias = res ? res : [];
      this.disponible.emit(this.disponibilidad);
      console.log('Disponibilidad calculada: {}', this.disponibilidad);
      this.cd.markForCheck();
    });
  }
}
