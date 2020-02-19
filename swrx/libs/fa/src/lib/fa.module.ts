import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faFileInvoiceDollar,
  faFileInvoice,
  faShoppingCart,
  faHandHoldingUsd,
  faCogs,
  faBell,
  faUsers,
  faUser,
  faLayerGroup,
  faHome,
  faClock,
  faCheckCircle,
  faCommentSlash,
  faTh,
  faTruckLoading,
  faCartArrowDown,
  faCut,
  faTimesCircle,
  faTruck,
  faRoute,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  exports: [FontAwesomeModule]
})
export class FaModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faFileInvoice,
      faFileInvoiceDollar,
      faShoppingCart,
      faHandHoldingUsd,
      faCogs,
      faBell,
      faUsers,
      faUser,
      faLayerGroup,
      faHome,
      faClock,
      faCheckCircle,
      faCommentSlash,
      faTh,
      faTruckLoading,
      faCartArrowDown,
      faCut,
      faTimesCircle,
      faTruck,
      faRoute,
      faChartLine
    );
  }
}
