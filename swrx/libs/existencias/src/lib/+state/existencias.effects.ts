import { Injectable } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { createEffect, Actions, OnInitEffects, ofType } from '@ngrx/effects';

import { DataPersistence } from '@nrwl/angular';

import { ExistenciasPartialState } from './existencias.reducer';
import * as ExistenciasActions from './existencias.actions';
import { ExistenciasService } from '../services/existencias.service';
import { ExistenciasEntity } from '../+state/existencias.models';

import { of } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  filter,
  tap,
  take,
  catchError
} from 'rxjs/operators';

import { DocumentChangeAction } from '@angular/fire/firestore';

const mapToExistencia = (
  item: DocumentChangeAction<ExistenciasEntity>
): ExistenciasEntity => {
  const data = item.payload.doc.data();
  const id = item.payload.doc.id;
  return { id, ...data };
};

const mapToExistenciaAction = (
  item: DocumentChangeAction<ExistenciasEntity>
) => {
  const existencia = mapToExistencia(item);
  switch (item.type) {
    case 'modified':
    case 'added':
      return ExistenciasActions.upsertExistencia({ existencia });
    default:
      throw Error(`Firebase DocumentChangeAction ${item.type} not supported`);
  }
};

@Injectable()
export class ExistenciasEffects implements OnInitEffects {
  loadExistencias$ = createEffect(() =>
    this.dataPersistence.fetch(ExistenciasActions.loadExistencias, {
      run: (action, state) =>
        this.service.fetchExistencias().pipe(
          take(1),
          tap(exis => console.log('Exis: ', exis)),
          switchMap(exis =>
            of(ExistenciasActions.loadExistenciasSuccess({ existencias: exis }))
          )
        ),
      onError: (action, error) => {
        console.error('Error', error);
        return ExistenciasActions.loadExistenciasFailure({ error });
      }
    })
  );

  /*
  watch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ExistenciasActions.loadExistencias),
        switchMap(() => this.service.getAllExistenciasAsStateChantes()),
        filter(actions => actions.length === 1),
        map(actions => mapToExistencia(actions[0])),
        tap(exis => console.log('Exis change :', exis)),
        map(existencia => ExistenciasActions.upsertExistencia({ existencia })),
        catchError(error =>
          of(ExistenciasActions.loadExistenciasFailure({ error }))
        )
      ),
    { dispatch: false }
  );
  */

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<ExistenciasPartialState>,
    private service: ExistenciasService
  ) {}

  ngrxOnInitEffects(): Action {
    console.log('Inicializando Existencias effect');
    return { type: '[Existencias Effect]: Inicializando' };
    // return ExistenciasActions.loadExistencias();
  }
}
