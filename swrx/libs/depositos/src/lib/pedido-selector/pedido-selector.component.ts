import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Subject, throwError, empty, of } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  tap,
  catchError
} from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

import { Pedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-pedido-selector',
  templateUrl: './pedido-selector.component.html',
  styleUrls: ['./pedido-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidoSelectorComponent implements OnInit, OnDestroy {
  control = new FormControl(null, { updateOn: 'blur' });
  error;
  destroy$ = new Subject<boolean>();

  @Input() parent: FormGroup;
  _disabled = false;
  @Output() selected = new EventEmitter();
  constructor(
    @Inject('apiUrl') private api: string,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit2() {
    const res$ = this.control.valueChanges.pipe(
      tap(value => console.log('Tap: ', value)),
      debounceTime(500),
      distinctUntilChanged(),
      map(value => new HttpParams().set('folio', value)),
      switchMap(
        params => this.http.get(`${this.api}/pedidos/findByFolio`, { params })
        // .pipe(catchError((error: any) => throwError(error)))
      ),
      catchError((error: any) => {
        if (error.status === 404) {
          console.error('Error: ', error);
          return of(null);
        } else {
          return throwError(error);
        }
      }),
      takeUntil(this.destroy$)
    );

    res$.subscribe(value => {
      this.parent.get('pedido').setValue(value);
      this.cd.markForCheck();
    });

    const pedido = this.parent.get('pedido').value;
    if (pedido) {
      // this.selected = pedido;
      // this.control.disable();
      console.log('Pedido vinculado: ', pedido);
      this.control.setValue(pedido.folio, { emitEvent: false });
    }
  }

  ngOnInit() {
    this.control.valueChanges
      .pipe(
        tap(value => console.log('Tap: ', value)),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(folio => this.lookupPedido(folio));
    const pedido = this.parent.get('pedido').value;
    if (pedido) {
      this.control.setValue(pedido.folio, { emitEvent: false });
    }
  }

  private lookupPedido(folio: string) {
    const params = new HttpParams().set('folio', folio);
    this.http
      .get<Pedido>(`${this.api}/pedidos/findByFolio`, { params })
      .subscribe(
        found => {
          if (found) {
            console.log('Pedido vinculado: ', found);
            this.parent.get('pedido').setValue(found);
            this.cd.markForCheck();
            // this.control.setValue(found.folio, { emitEvent: false });
          }
        },
        err => {
          console.error('Pedido not found', err);
          this.parent.get('pedido').setValue(null);
          this.cd.markForCheck();
        }
      );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getErrorMessage() {
    return 'No existe el pedido';
  }

  get pedido() {
    return this.parent.get('pedido').value;
  }

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    this._disabled ? this.control.disable() : this.control.enable();
  }
  get disabled() {
    return this._disabled;
  }
}
