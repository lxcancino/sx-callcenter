import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { NAVIGATION } from '../navigation';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '@swrx/core-model';

@Component({
  selector: 'swrx-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit, OnDestroy {
  routes: any[] = NAVIGATION;
  destroy$ = new Subject<boolean>();
  user: any = null;
  user$: Observable<User>;

  constructor(public firebaseAuth: AngularFireAuth) {}

  ngOnInit() {
    this.user$ = this.firebaseAuth.user;
    this.user$.subscribe(u => console.log('U:', u));
    this.firebaseAuth.user.pipe(takeUntil(this.destroy$)).subscribe(usr => {
      const { displayName, email } = usr;
      this.user = { displayName, email };
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
