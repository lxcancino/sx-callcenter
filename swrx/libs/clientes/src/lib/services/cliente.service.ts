import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Cliente } from '@swrx/core-model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/clientes`;
  }

  save(payload: Partial<Cliente>): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.apiUrl, payload)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Cliente> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Cliente>(url);
  }

  update(update: Update<Cliente>): Observable<Cliente> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Cliente>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
