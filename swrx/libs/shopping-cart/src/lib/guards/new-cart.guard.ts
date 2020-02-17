import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { CartFacade } from '../+state/cart.facade';

@Injectable({
  providedIn: 'root'
})
export class NewCartGuard implements CanActivate {
  constructor(private facade: CartFacade) {}
  canActivate(next: ActivatedRouteSnapshot): boolean {
    this.facade.cleanShoppingCartState();
    return true;
  }
}
