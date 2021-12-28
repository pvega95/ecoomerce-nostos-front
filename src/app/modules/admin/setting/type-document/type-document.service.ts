import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { TypeDocument } from '../../../../models/document-type';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

  
  export class TypeDocumentService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = '/configuration-management';
    constructor(private http: HttpClient) {}
    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
      }
  
    getTypeListDocument():  Observable<any> {
      const url = `${TypeDocumentService.BASE_URL}${TypeDocumentService.confManagement}/document-type`;
      return this.http.get(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    /**
     * 
     * @param body 
     * @returns 
     */
    createTypeDocument(body: TypeDocument):  Observable<any> {
      const url = `${TypeDocumentService.BASE_URL}${TypeDocumentService.confManagement}/document-type`;
      return this.http.post(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    updateTypeDocument(id: string, body: TypeDocument):  Observable<any> {
      const url = `${TypeDocumentService.BASE_URL}${TypeDocumentService.confManagement}/document-type/${id}`;
      return this.http.put(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    deleteTypeDocument(id: string):  Observable<any> {
      const url = `${TypeDocumentService.BASE_URL}${TypeDocumentService.confManagement}/document-type/${id}`;
      return this.http.delete(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 

  }