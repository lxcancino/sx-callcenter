import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
/**
 * Temporal fix this is not the right way to acces the state from a lazy loaded module
 */
// tslint:disable-next-line: nx-enforce-module-boundaries
import { CartFacade } from '@swrx/shopping-cart';
import { User } from '@swrx/core-model';

import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'swrx-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit, OnDestroy {
  title = 'SIIPAP Rx Call Center';
  cartItmes$ = this.cartFacade.cartItemsCount$;
  currentPedidoId = undefined;
  destroy$ = new Subject<boolean>();
  user: User;

  constructor(
    private cartFacade: CartFacade,
    private firebaseAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.cartFacade.currentPedido
      .pipe(takeUntil(this.destroy$))
      .subscribe(p => {
        if (p) {
          this.currentPedidoId = p.id;
        } else {
          this.currentPedidoId = null;
        }
      });
    this.firebaseAuth.user.pipe(takeUntil(this.destroy$)).subscribe(usr => {
      if (usr) {
        this.user = User.fromFirebaseUser(usr);
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  signOut() {
    this.firebaseAuth.auth
      .signOut()
      .then(() => console.log('Logout success'))
      .catch(e => console.error('An error happened while signing out!', e));
  }
}
