import { Injectable } from '@angular/core';

import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { ExistenciasEntity } from '../+state/existencias.models';

@Injectable({
  providedIn: 'root'
})
export class ExistenciasService {
  constructor(private afs: AngularFirestore) {}

  getAllExistenciasAsStateChantes() {
    return this.afs
      .collection<ExistenciasEntity>('existencias')
      .stateChanges(['added', 'modified']);
  }

  fetchExistencias(): Observable<ExistenciasEntity[]> {
    console.log('Loading existencias....');
    return this.afs
      .collection('existencias')
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
      .collection<ExistenciasEntity>('existencia')
      .doc(id)
      .collection('almacenes')
      .valueChanges()
      .pipe(catchError((error: any) => throwError(error)));
  }
}
