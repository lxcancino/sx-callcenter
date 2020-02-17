import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { catchError, finalize, delay, takeUntil } from 'rxjs/operators';

import { Producto } from '@swrx/core-model';
import { ProductoService } from '@swrx/productos';

@Component({
  selector: 'swrx-productos-page',
  templateUrl: './productos-page.component.html',
  styleUrls: ['./productos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosPageComponent implements OnInit {
  productos$: Observable<Producto[]>;
  loading = false;
  destroy$ = new Subject<boolean>();

  constructor(private service: ProductoService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.productos$ = this.service.list(5000).pipe(
      delay(700),
      finalize(() => (this.loading = false)),
      catchError(e => of([])),
      takeUntil(this.destroy$)
    );
  }
}
