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
  catchError
} from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

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

  ngOnInit() {
    const res$ = this.control.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(value => new HttpParams().set('folio', value)),
      switchMap(params =>
        this.http.get(`${this.api}/pedidos/findByFolio`, { params })
      ),
      catchError((error: any) => {
        if (error.status === 404) {
          return of(null);
        } else {
          throwError(error);
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
