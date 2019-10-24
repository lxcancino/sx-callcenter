import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { DepositosPartialState } from './depositos.reducer';
import * as DepositosActions from './depositos.actions';

@Injectable()
export class DepositosEffects {
  loadDepositos$ = createEffect(() =>
    this.dataPersistence.fetch(DepositosActions.loadDepositos, {
      run: (
        action: ReturnType<typeof DepositosActions.loadDepositos>,
        state: DepositosPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return DepositosActions.loadDepositosSuccess({ depositos: [] });
      },

      onError: (
        action: ReturnType<typeof DepositosActions.loadDepositos>,
        error
      ) => {
        console.error('Error', error);
        return DepositosActions.loadDepositosFailure({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<DepositosPartialState>
  ) {}
}
