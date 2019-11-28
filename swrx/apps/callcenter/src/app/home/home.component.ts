import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthProvider } from 'ngx-auth-firebaseui';
@Component({
  selector: 'swrx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  providers = AuthProvider;
  user: Observable<User>;
  links = [
    { icon: 'home', text: 'Home', callback: this.printLog },
    { icon: 'favorite', text: 'Favorite', callback: this.printLog },
    { icon: 'add', text: 'Add', callback: this.printLog }
  ];
  constructor(public afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.user = this.afAuth.user;
    this.afAuth.authState.subscribe(state => {
      console.log('AuthState: ', state);
    });
  }

  login() {
    const provider = new auth.GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    this.afAuth.auth.signInWithPopup(provider).then(
      value => {
        console.log('Authentication success: ', value);
      },
      error => {
        console.log('Cant authenticate', error);
      }
    );
  }

  printUser(event) {
    console.log('Success: ', event);
  }

  printLog() {
    console.log('Log ');
  }
}
