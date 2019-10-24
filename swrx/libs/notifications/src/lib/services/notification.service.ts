import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private collection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.collection = this.afs.collection('notifications');

    /*
    this.collection.stateChanges().subscribe(dca => {
      console.log('stateChanges: ', dca);
    });
    */

    this.collection.snapshotChanges().subscribe(dca => {
      console.log('snapshotChanges: ', dca);
    });
    /*

    this.collection.snapshotChanges()
    .subscribe(dca => {
      console.log('snapshotChanges: ', dca);
    });
    */
  }

  fetchNotifications(): Observable<any[]> {
    return this.afs.collection('notifications').valueChanges();
  }

  addNotification() {
    const n = {
      message: `Notification ${Math.floor(Math.random() * 24)}`,
      user: 'rcancino',
      time: new Date().toISOString()
    };
    this.afs.collection('notifications').add(n);
  }
}
