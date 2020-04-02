import { Injectable } from '@angular/core';

import { Observable, throwError, from } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { ExistenciasEntity } from '../+state/existencias.models';

@Injectable({
  providedIn: 'root'
})
export class ExistenciasService {
  COLLECTION = 'existencias';

  constructor(private afs: AngularFirestore) {}

  fetchExistencias(): Observable<ExistenciasEntity[]> {
    return this.afs
      .collection(this.COLLECTION)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as ExistenciasEntity;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        ),
        catchError((error: any) => throwError(error))
      );
  }

  findExistencias(id: string): Observable<any> {
    return this.afs
      .collection<ExistenciasEntity>(this.COLLECTION)
      .doc(id)
      .collection('almacenes')
      .valueChanges()
      .pipe(
        take(1),
        catchError((error: any) => throwError(error))
      );
  }
}
