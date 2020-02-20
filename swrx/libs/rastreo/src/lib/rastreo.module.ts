import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { RastreoComponent } from './rastreo/rastreo.component';
import { RastreoListComponent } from './rastreo-list/rastreo-list.component';
import { RastreoItemComponent } from './rastreo-list/rastreo-item/rastreo-item.component';
import { RastreoPageComponent } from './rastreo-page/rastreo-page.component';

 export const routes: Route[] = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      { path: 'all', component: RastreoPageComponent }
    ]
  }
]; 

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
    UiCoreModule
],
  declarations: [RastreoComponent, RastreoListComponent, RastreoItemComponent, RastreoPageComponent],
  exports: [RastreoComponent, RastreoListComponent, RastreoItemComponent, RastreoPageComponent]
})
export class RastreoModule {}
