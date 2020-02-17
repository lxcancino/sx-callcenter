import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Update } from '@ngrx/entity';

import { Transporte } from './transporte';

@Injectable({
  providedIn: 'root'
})
export class TransportesService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/transportes`;
  }

  list(): Observable<Transporte[]> {
    return this.http
      .get<Transporte[]>(this.apiUrl)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(payload: Partial<Transporte>): Observable<Transporte> {
    return this.http.post<Transporte>(this.apiUrl, payload);
  }

  get(id: string): Observable<Transporte> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Transporte>(url);
  }

  update(update: Update<Transporte>): Observable<Transporte> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Transporte>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
