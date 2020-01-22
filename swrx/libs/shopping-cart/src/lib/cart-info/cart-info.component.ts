import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabGroup, MatTab } from '@angular/material';

import { CartFacade } from '../+state/cart.facade';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pedido } from '@swrx/core-model';
import { PedidosFacade } from '@swrx/pedidos';

@Component({
  selector: 'swrx-cart-info',
  templateUrl: './cart-info.component.html',
  styleUrls: ['./cart-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartInfoComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() cartForm: FormGroup;
  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;
  @ViewChild('errorsTab', { static: true }) errorsTab: MatTab;
  @ViewChild('warningsTab', { static: true }) warningsTab: MatTab;
  @Output() autorizar = new EventEmitter<Partial<Pedido>>();
  autorizaciones$;
  currentTab = 2;

  destroy$ = new Subject();
  warnings: any[];

  constructor(public facade: CartFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.facade.hasErrors$.pipe(takeUntil(this.destroy$)).subscribe(invalid => {
      if (invalid) {
        this.tabGroup.selectedIndex = 4;
      }
    });
    this.facade.warnings$.pipe(takeUntil(this.destroy$)).subscribe(warnings => {
      this.warnings = warnings;
      if (warnings.length > 0) {
        this.tabGroup.selectedIndex = 5;
        this.cd.markForCheck();
      }
    });
    this.autorizaciones$ = this.facade.autorizaciones$;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  actualizarEnvio() {
    this.facade.registrarEnvio();
    this.cartForm.markAsDirty();
  }

  cancelarEnvio() {
    this.facade.cancelarEnvio();
    this.cartForm.markAsDirty();
  }
}
