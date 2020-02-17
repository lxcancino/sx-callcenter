import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material';

import { UiCoreModule } from '@swrx/ui-core';
import { AuthModule } from '@swrx/auth';

import { MainPageComponent } from './main-page.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';

@NgModule({
  imports: [RouterModule, UiCoreModule, MatSidenavModule, AuthModule],
  declarations: [MainPageComponent, MainToolbarComponent]
})
export class MainPageModule {}
