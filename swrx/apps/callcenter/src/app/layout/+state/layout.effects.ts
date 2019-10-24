import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { LayoutPartialState } from './layout.reducer';
import * as LayoutActions from './layout.actions';

@Injectable({ providedIn: 'root' })
export class LayoutEffects {
  loadLayout$ = createEffect(() =>
    this.dataPersistence.fetch(LayoutActions.loadLayout, {
      run: (
        action: ReturnType<typeof LayoutActions.loadLayout>,
        state: LayoutPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return LayoutActions.loadLayoutSuccess({ layout: [] });
      },

      onError: (action: ReturnType<typeof LayoutActions.loadLayout>, error) => {
        console.error('Error', error);
        return LayoutActions.loadLayoutFailure({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<LayoutPartialState>
  ) {}
}
