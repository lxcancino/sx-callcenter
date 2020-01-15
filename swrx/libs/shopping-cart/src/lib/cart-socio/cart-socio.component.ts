import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Socio } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-socio',
  templateUrl: './cart-socio.component.html',
  styleUrls: ['./cart-socio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartSocioComponent implements OnInit, OnDestroy {
  filteredOptions: Observable<Socio[]>;
  @Input() socios: Socio[] = [];
  @Input() disabled = false;
  @Input() current: Socio;
  @Output() registrarSocio = new EventEmitter<Socio>();
  control = new FormControl({ value: null, disabled: this.disabled });

  destroy$ = new Subject<boolean>();

  constructor() {}

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.nombre)),
      map(nombre => (nombre ? this._filter(nombre) : this.socios.slice())),
      map(socios => this._sort(socios)),
      takeUntil(this.destroy$)
    );
    
    if(this.current) {
      this.control.setValue(this.current, {emitEvent: false});
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  displayFn(socio?: Socio): string | undefined {
    return socio ? socio.nombre : undefined;
  }
  private _filter(nombre: string): Socio[] {
    const filterValue = nombre.toLowerCase();
    return this.socios.filter(option =>
      option.nombre.toLowerCase().includes(filterValue)
    );
  }
  private _sort(socios: Socio[]) {
    return socios.sort((itemA, itemB) =>
      itemA.nombre.toLowerCase().localeCompare(itemB.nombre.toLowerCase())
    );
  }

  get selected(): Socio | null {
    if (this.control.value && typeof this.control.value === 'string') {
      return null;
    } else {
      return this.control.value;
    }
  }
}
