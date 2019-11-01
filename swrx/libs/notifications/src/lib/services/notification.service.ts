import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Notification } from '../+state/notification.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private collection: AngularFirestoreCollection<Notification>;

  constructor(private afs: AngularFirestore) {
    // this.collection = this.afs.collection<Notification>('notifications');
    /*
    this.collection.stateChanges().subscribe(dca => {
      console.log('stateChanges: ', dca);
    });
    */
    /*
    this.collection.snapshotChanges().subscribe(dca => {
      console.log('snapshotChanges: ', dca);
    });
    */
    /*

    this.collection.snapshotChanges()
    .subscribe(dca => {
      console.log('snapshotChanges: ', dca);
    });
    */
  }

  getAllNotificationsAsStateChantes() {
    return this.afs.collection<Notification>('notifications').stateChanges();
  }

  fetchNotifications(): Observable<Notification[]> {
    return this.afs
      .collection('notifications')
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Notification;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  addNotification(n: Notification) {}
}
