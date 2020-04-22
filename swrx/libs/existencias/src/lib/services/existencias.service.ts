import { Injectable } from '@angular/core';

import { Observable, throwError, forkJoin } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { ExistenciasEntity } from '../+state/existencias.models';
import { PedidoDet } from '@swrx/core-model';

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

  actualizarFaltantes(items: Partial<PedidoDet>[], sucursal: string) {
    const rows: Observable<Partial<PedidoDet>>[] = [];
    items.forEach(item => {
      rows.push(this.calcularFaltante(item, sucursal));
    });
    const joins = forkJoin(rows);
    return joins;
  }

  calcularFaltante(
    item: Partial<PedidoDet>,
    sucursal: string
  ): Observable<Partial<PedidoDet>> {
    const path = `${this.COLLECTION}/${item.producto.id}/almacenes/${sucursal}`;
    const dd = this.afs
      .doc<{ cantidad: number; clave: string }>(path)
      .valueChanges()
      .pipe(
        map(exis => {
          if (exis) {
            const diff = item.cantidad - exis.cantidad;
            const faltante = diff > 0 ? diff : 0;
            console.groupCollapsed('Validando existencia', item.clave);
            console.log('Cantidad solicitada: ', item.cantidad);
            console.log('Existencia: ', exis.cantidad);
            console.log('Faltante: ', faltante);
            console.groupEnd();
            return { ...item, faltante };
          } else {
            return { ...item, faltante: item.cantidad };
          }
        }),
        catchError((error: any) => {
          console.log('Error: ', error);
          return throwError(error);
        }),
        take(1)
      );
    return dd;
  }
}
