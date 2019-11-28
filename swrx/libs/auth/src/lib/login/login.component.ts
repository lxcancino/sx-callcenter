import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { labels } from './ui-labels';
import { AuthComponent } from 'ngx-auth-firebaseui';
import assignIn from 'lodash/assignIn';

@Component({
  selector: 'swrx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, AfterViewInit {
  ngxauthfirebaseui = labels;

  loginSuccessMsg = 'Acceso al sistema obtenido Bienvenido a SX CALLCENTER!';
  loginFailMsg = 'Error de acceso! usuario y/o contraseña incorrectos';

  @ViewChild('authComponent', { static: true }) control: AuthComponent;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    assignIn(this.control, this.ngxauthfirebaseui);
  }
}
