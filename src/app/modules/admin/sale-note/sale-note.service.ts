import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

  export class SaleNoteService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = '/order-management';
    constructor(private http: HttpClient) {}
    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
      }
  
    getListSaleNote():  Observable<any> {
      const url = `${SaleNoteService.BASE_URL}${SaleNoteService.confManagement}/sales`;
      return this.http.get(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 

    getSerie(companyId: string, documentId: string):  Observable<any> {
      const url = `${SaleNoteService.BASE_URL}/configuration-management/document-serial/${companyId}/${documentId}`;
      return this.http.get(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 

/*     createSaleNote(body: any):  Observable<any> {
      const url = `${SaleNoteService.BASE_URL}${SaleNoteService.confManagement}/document-serial`;
      return this.http.post(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    updateSaleNote(id: string, body: any):  Observable<any> {
      const url = `${SaleNoteService.BASE_URL}${SaleNoteService.confManagement}/document-serial/${id}`;
      return this.http.put(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    deleteSaleNote(id: string):  Observable<any> {
      const url = `${SaleNoteService.BASE_URL}${SaleNoteService.confManagement}/document-serial/${id}`;
      return this.http.delete(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    }  */

  }