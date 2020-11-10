import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { Producto } from 'src/app/models';
import { AngularFirestore } from '@angular/fire/firestore';

import sortBy from 'lodash-es/sortBy';
import keyBy from 'lodash-es/keyBy';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private productosUrl = 'assets/data/productos.json';
  private lineasUrl = 'assets/data/lineas.json';
  private marcasUrl = 'assets/data/marcas.json';

  productos$: Observable<Producto[]> = this.http
    .get<Producto[]>(this.productosUrl)
    .pipe(
      shareReplay(),
      map((productos) => sortBy(productos, 'linea')),
      catchError((error: any) => throwError(error))
    );

  productosMap$: Observable<{ [key: string]: Producto }> = this.productos$.pipe(
    map((productos) => keyBy(productos, 'clave'))
  );

  lineas$: Observable<any> = this.http
    .get<any>(this.lineasUrl)
    .pipe(catchError((error: any) => throwError(error)));
  marcas$: Observable<any> = this.http
    .get<any>(this.marcasUrl)
    .pipe(catchError((error: any) => throwError(error)));

  productos2$ = this.firestore
    .collection<Producto>('productos', (ref) =>
      ref.where('linea', '==', 'BOND').limit(10)
    )
    .valueChanges()
    .pipe(
      shareReplay(),
      catchError((error: any) => throwError(error))
    );

  constructor(private http: HttpClient, private firestore: AngularFirestore) {}

  fetch() {
    this.firestore
      .collection<Producto>('productos', (ref) =>
        ref.where('linea', '==', 'BOND').limit(10)
      )
      .valueChanges()
      .subscribe((actions) => {
        console.log('Actions: ', actions);
      });
  }

  findByClave(clave: string): Observable<Producto> {
    return this.productosMap$.pipe(
      map((productos) => productos[clave.toUpperCase()])
    );
  }
}
