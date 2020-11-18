import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { Cliente } from 'src/app/models';
import { AngularFirestore } from '@angular/fire/firestore';

import sortBy from 'lodash-es/sortBy';
import keyBy from 'lodash-es/keyBy';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private clientesUrl = 'assets/data/clientes-credito.json';

  clientes$: Observable<Cliente[]> = this.http
    .get<Cliente[]>(this.clientesUrl)
    .pipe(
      shareReplay(),
      catchError((error: any) => throwError(error))
    );

  repository$: Observable<{ [key: string]: Cliente }> = this.clientes$.pipe(
    map((cliente) => keyBy(cliente, 'id'))
  );

  constructor(private http: HttpClient, private firestore: AngularFirestore) {}

  findById(id: string): Observable<Cliente> {
    return this.repository$.pipe(map((directory) => directory[id]));
  }
}
