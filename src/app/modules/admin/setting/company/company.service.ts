import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Company, ICompany } from '../../../../models/company';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

  
  export class CompanyService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = '/configuration-management';
    constructor(private http: HttpClient) {}
    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
      }
  
    getListCompany():  Observable<any> {
      const url = `${CompanyService.BASE_URL}${CompanyService.confManagement}/company`;
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
    createCompany(body: Company):  Observable<any> {
      const url = `${CompanyService.BASE_URL}${CompanyService.confManagement}/company`;
      return this.http.post(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    updateCompany(id: string, body: Company):  Observable<any> {
      const url = `${CompanyService.BASE_URL}${CompanyService.confManagement}/company/${id}`;
      return this.http.put(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    deleteCompany(id: string):  Observable<any> {
      const url = `${CompanyService.BASE_URL}${CompanyService.confManagement}/company/${id}`;
      return this.http.delete(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 

  }