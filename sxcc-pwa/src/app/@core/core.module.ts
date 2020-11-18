import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

const COMMON_MODULES = [CommonModule];

@NgModule({
  declarations: [],
  imports: [...COMMON_MODULES],
  exports: [...COMMON_MODULES],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        '@CoreModule is already loaded. Import it in the AppModule/CoreModule only'
      );
    }
  }
}
