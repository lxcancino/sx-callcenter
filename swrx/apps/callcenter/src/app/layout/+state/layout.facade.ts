import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromLayout from './layout.reducer';
import * as LayoutSelectors from './layout.selectors';
import * as LayoutActions from './layout.actions';

@Injectable()
export class LayoutFacade {
  loaded$ = this.store.pipe(select(LayoutSelectors.getLayoutLoaded));
  allLayout$ = this.store.pipe(select(LayoutSelectors.getAllLayout));
  selectedLayout$ = this.store.pipe(select(LayoutSelectors.getSelected));

  constructor(private store: Store<fromLayout.LayoutPartialState>) {}

  loadAll() {
    this.store.dispatch(LayoutActions.loadLayout());
  }
}
