import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError, Subject } from 'rxjs';
import { catchError, take, tap, map } from 'rxjs/operators';

import { Producto } from '@swrx/core-model';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl: string;

  productos$ = new Subject<Producto[]>();

  constructor(
    private http: HttpClient,
    @Inject('apiUrl') api,
    private afs: AngularFirestore
  ) {
    this.apiUrl = `${api}/productos`;
  }

  list(max: number): Observable<Producto[]> {
    const params = new HttpParams().set('rows', max.toString());
    return this.http
      .get<Producto[]>(this.apiUrl, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  fetchAll() {
    /*
    const params = new HttpParams().set('rows', '5000');
    this.http
      .get<Producto[]>(this.apiUrl, { params })
      .pipe(take(1))
      .subscribe( data => this.productos$.next(data), err => console.log('Err: ', err));
      */
    return this.afs
      .collection<Producto>('productos')
      .valueChanges()
      .pipe(tap(data => console.log('Data: ', data)));
  }

  addListener() {
    this.afs
      .collection<Producto>('productos', ref =>
        ref
          .where('activo', '==', true)
          .orderBy('clave')
          .limit(2)
      )
      .stateChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Producto;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe(sc => {
        console.log('Stater change: ', sc);
      });
  }
}
