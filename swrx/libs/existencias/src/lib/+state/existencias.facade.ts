import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromExistencias from './existencias.reducer';
import * as ExistenciasSelectors from './existencias.selectors';
import * as ExistenciasActions from './existencias.actions';

@Injectable()
export class ExistenciasFacade {
  loaded$ = this.store.pipe(select(ExistenciasSelectors.getExistenciasLoaded));
  allExistencias$ = this.store.pipe(
    select(ExistenciasSelectors.getAllExistencias)
  );
  selectedExistencias$ = this.store.pipe(
    select(ExistenciasSelectors.getSelected)
  );

  constructor(private store: Store<fromExistencias.ExistenciasPartialState>) {}

  loadAll() {
    this.store.dispatch(ExistenciasActions.loadExistencias());
  }
}
