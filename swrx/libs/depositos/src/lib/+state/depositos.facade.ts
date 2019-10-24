import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromDepositos from './depositos.reducer';
import * as DepositosSelectors from './depositos.selectors';
import * as DepositosActions from './depositos.actions';

@Injectable()
export class DepositosFacade {
  loaded$ = this.store.pipe(select(DepositosSelectors.getDepositosLoaded));
  allDepositos$ = this.store.pipe(select(DepositosSelectors.getAllDepositos));
  selectedDepositos$ = this.store.pipe(select(DepositosSelectors.getSelected));

  constructor(private store: Store<fromDepositos.DepositosPartialState>) {}

  loadAll() {
    this.store.dispatch(DepositosActions.loadDepositos());
  }
}
