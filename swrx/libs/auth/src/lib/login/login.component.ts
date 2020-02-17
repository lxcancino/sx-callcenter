import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';

import { labels } from './ui-labels';
import { AuthComponent } from 'ngx-auth-firebaseui';
import assignIn from 'lodash/assignIn';

import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

import { Observable } from 'rxjs';

@Component({
  selector: 'swrx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, AfterViewInit {
  ngxauthfirebaseui = labels;

  loginSuccessMsg = 'BIENVENIDO A  SX-CALLCENTER!';
  loginFailMsg = 'Error de acceso! usuario y/o contraseña incorrectos';

  user$: Observable<User>;

  @ViewChild('authComponent', { static: true }) control: AuthComponent;

  constructor(public firebaseAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.user$ = this.firebaseAuth.user;
  }

  ngAfterViewInit() {
    assignIn(this.control, this.ngxauthfirebaseui);
  }

  signOut() {
    this.firebaseAuth.auth
      .signOut()
      .then(() => console.log('Logout success'))
      .catch(e => console.error('An error happened while signing out!', e));
  }

  onSuccess(event: any) {
    this.router.navigate(['/inicio']);
  }
}
