import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCart from './+state/cart.reducer';
import { CartEffects } from './+state/cart.effects';

import { UiCoreModule } from '@swrx/ui-core';
import { ClientesModule } from '@swrx/clientes';
import { ProductosModule } from '@swrx/productos';
import { FormUtilsModule } from '@swrx/form-utils';
import { PedidosModule } from '@swrx/pedidos';

import { CartPageComponent } from './cart-page/cart-page.component';
import { CartBtnComponent } from './cart-btn/cart-btn.component';
import { CartToolbarComponent } from './cart-toolbar/cart-toolbar.component';

import { CartItemsComponent } from './cart-items/cart-items.component';
import { CartFooterComponent } from './cart-footer/cart-footer.component';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { CartInfoComponent } from './cart-info/cart-info.component';
import { CartFormModule } from './cart-form/cart-form.module';
import { CartFacade } from './+state/cart.facade';
import { CartAddItemComponent } from './cart-add-item/cart-add-item.component';
import { CartItemsTableComponent } from './cart-items/cart-items-table/cart-items-table.component';
import { CartListComponent } from './cart-items/cart-list/cart-list.component';
import { CartListItemComponent } from './cart-items/cart-list/cart-list-item/cart-list-item.component';
import { CartCheckoutComponent } from './cart-checkout/cart-checkout.component';
import { CartEditItemComponent } from './cart-edit-item/cart-edit-item.component';
import { CartEditPageComponent } from './cart-edit-page/cart-edit-page.component';
import { CartPersistenceEffects } from './+state/cart-persistence.effects';
import { EnvioComponent } from './envio/envio.component';
import { EnvioPanelComponent } from './envio/envio-panel/envio-panel.component';
import { CfdiTabComponent } from './cart-info/cfdi-tab/cfdi-tab.component';
import { MatStepperModule, MatTableModule } from '@angular/material';
import { CartNombreComponent } from './cart-nombre/cart-nombre.component';
import { CerrarComponent } from './cerrar/cerrar.component';
import { TransporteFieldComponent } from './envio/transporte-field/transporte-field.component';

import { NewCartGuard } from './guards/new-cart.guard';
import { CartSocioComponent } from './cart-socio/cart-socio.component';
import { CartExistenciasComponent } from './cart-existencias/cart-existencias.component';

const routes: Route[] = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'cart', pathMatch: 'full' },
      {
        path: 'cart',
        component: CartPageComponent
        // canActivate: [NewCartGuard]
      },
      { path: 'cart/:id', component: CartEditPageComponent }
    ]
  }
];

@NgModule({
  imports: [
    UiCoreModule,
    MatStepperModule,
    MatTableModule,
    ClientesModule,
    ProductosModule,
    PedidosModule,
    FormUtilsModule,
    StoreModule.forFeature(fromCart.CART_FEATURE_KEY, fromCart.reducer),
    EffectsModule.forFeature([CartEffects, CartPersistenceEffects]),
    CartFormModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CartPageComponent,
    CartBtnComponent,
    CartToolbarComponent,
    CartItemsComponent,
    CartFooterComponent,
    CartSummaryComponent,
    CartInfoComponent,
    CartAddItemComponent,
    CartItemsTableComponent,
    CartListComponent,
    CartListItemComponent,
    CartCheckoutComponent,
    CartEditItemComponent,
    CartEditPageComponent,
    EnvioComponent,
    EnvioPanelComponent,
    CfdiTabComponent,
    CartNombreComponent,
    CerrarComponent,
    TransporteFieldComponent,
    CartSocioComponent,
    CartExistenciasComponent
  ],
  entryComponents: [
    CartAddItemComponent,
    CartCheckoutComponent,
    CartEditItemComponent,
    EnvioComponent,
    CartNombreComponent,
    CerrarComponent
  ],
  exports: [CartBtnComponent],
  providers: [CartFacade]
})
export class ShoppingCartModule {}
