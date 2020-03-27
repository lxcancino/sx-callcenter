import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Cliente, ClienteDireccion } from '@swrx/core-model';

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

  addMedio(clienteId: string, contacto: any): Observable<any> {
    const url = `${this.apiUrl}/${clienteId}/medios`;
    return this.http
      .post(url, contacto)
      .pipe(catchError((error: any) => throwError(error)));
  }

  deleteMedio(clienteId: string, contactoId: string) {
    const url = `${this.apiUrl}/${clienteId}/medios/${contactoId}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  updateMedio(clienteId: string, contacto: any): Observable<any> {
    const url = `${this.apiUrl}/${clienteId}/medios/${contacto.id}`;
    return this.http
      .put(url, contacto)
      .pipe(catchError((error: any) => throwError(error)));
  }

  addDireccion(
    clienteId: string,
    direccion: Partial<ClienteDireccion>
  ): Observable<ClienteDireccion> {
    const url = `${this.apiUrl}/${clienteId}/direcciones`;
    return this.http
      .post<ClienteDireccion>(url, direccion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  deleteDireccion(clienteId: string, direccionId: string) {
    const url = `${this.apiUrl}/${clienteId}/direcciones/${direccionId}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  updateDireccion(
    clienteId: string,
    direccionId: string,
    changes: Partial<ClienteDireccion>
  ): Observable<ClienteDireccion> {
    const url = `${this.apiUrl}/${clienteId}/direcciones/${direccionId}`;
    return this.http
      .put<ClienteDireccion>(url, changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
