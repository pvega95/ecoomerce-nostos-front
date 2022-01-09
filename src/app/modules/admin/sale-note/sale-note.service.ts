import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SaleNote } from 'app/models/sale-note';

@Injectable({
    providedIn: 'root',
})
export class SaleNoteService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly orderManagement = '/order-management';
    private _salesNotes: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    constructor(private http: HttpClient) {}

    /**
     * Getter for sale notes
     */
    get saleNotes$(): Observable<any[]> {
        return this._salesNotes.asObservable();
    }

    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
    }

    getListSaleNote(): Observable<any> {
        const url = `${SaleNoteService.BASE_URL}${SaleNoteService.orderManagement}/sales`;
        return this.http.get(url).pipe(
            tap((response: any) => {
                this._salesNotes.next(response);
            }),
            catchError((error) => this.formatErrors(error))
        );
    }

    getListSaleNoteById(id: string): Observable<any> {
        const url = `${SaleNoteService.BASE_URL}${SaleNoteService.orderManagement}/sales/${id}`;
        return this.http.get(url).pipe(
            catchError((error) => this.formatErrors(error))
        );
    }

    createSaleNote(body: any): Observable<any> {
        const url = `${SaleNoteService.BASE_URL}${SaleNoteService.orderManagement}/sales`;
        return this.http
            .post(url, body)
            .pipe(catchError((error: any) => this.formatErrors(error)));
    }

    updateSaleNote(body: any, id: string): Observable<any> {
        const url = `${SaleNoteService.BASE_URL}${SaleNoteService.orderManagement}/sales/${id}`;
        return this.http
            .put(url, body)
            .pipe(catchError((error: any) => this.formatErrors(error)));
    }

    deleteSaleNote(id: string): Observable<any> {
        const url = `${SaleNoteService.BASE_URL}${SaleNoteService.orderManagement}/sales/${id}`;
        return this.http
            .delete(url)
            .pipe(catchError((error: any) => this.formatErrors(error)));
    }

    getSerie(companyId: string, documentId: string): Observable<any> {
        const url = `${SaleNoteService.BASE_URL}/configuration-management/document-serial/${companyId}/${documentId}`;
        return this.http.get(url).pipe(
            catchError((error) => this.formatErrors(error))
        );
    }

}
