import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromLogs from './logs.reducer';
import * as LogsSelectors from './logs.selectors';
import * as LogsActions from './logs.actions';

@Injectable()
export class LogsFacade {
  loaded$ = this.store.pipe(select(LogsSelectors.getLogsLoaded));
  allLogs$ = this.store.pipe(select(LogsSelectors.getAllLogs));
  selectedLogs$ = this.store.pipe(select(LogsSelectors.getSelected));

  constructor(private store: Store<fromLogs.LogsPartialState>) {}

  loadAll() {
    this.store.dispatch(LogsActions.loadLogs());
  }
}
