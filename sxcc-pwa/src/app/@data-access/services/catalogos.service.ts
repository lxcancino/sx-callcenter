import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { Producto, Sucursal } from 'src/app/models';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private sucursalesUrl = 'assets/data/sucursales.json';

  sucursales$: Observable<Sucursal[]> = this.http
    .get<Sucursal[]>(this.sucursalesUrl)
    .pipe(
      shareReplay(),
      catchError((error: any) => throwError(error))
    );

  constructor(private http: HttpClient, private firestore: AngularFirestore) {}
}
