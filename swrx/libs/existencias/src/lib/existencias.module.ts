import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromExistencias from './+state/existencias.reducer';
import { ExistenciasEffects } from './+state/existencias.effects';
import { ExistenciasFacade } from './+state/existencias.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromExistencias.EXISTENCIAS_FEATURE_KEY,
      fromExistencias.reducer
    ),
    EffectsModule.forFeature([ExistenciasEffects])
  ],
  providers: [ExistenciasFacade]
})
export class ExistenciasModule {}
