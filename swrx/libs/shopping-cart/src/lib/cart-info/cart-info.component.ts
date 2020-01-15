import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabGroup, MatTab } from '@angular/material';

import { CartFacade } from '../+state/cart.facade';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'swrx-cart-info',
  templateUrl: './cart-info.component.html',
  styleUrls: ['./cart-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartInfoComponent implements OnInit, OnDestroy {
  @Input() cartForm: FormGroup;
  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;
  @ViewChild('errorsTab', { static: true }) errorsTab: MatTab;
  @ViewChild('warningsTab', { static: true }) warningsTab: MatTab;

  destroy$ = new Subject();

  constructor(public facade: CartFacade) {}

  ngOnInit() {
    this.facade.hasWarnings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(invalid => {
        if (invalid) {
          this.tabGroup.selectedIndex = this.warningsTab.position;
        }
      });

    this.facade.hasErrors$.pipe(takeUntil(this.destroy$)).subscribe(invalid => {
      if (invalid) {
        this.tabGroup.selectedIndex = this.errorsTab.position;
      }
    });
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
