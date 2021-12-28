import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    static readonly BASE_URL = `${environment.backendURL}`;

    constructor(private _http: HttpClient) {}

    crearProducto(body: any): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management`;
        const data = body;
        return this._http.post(query, data);
    }

    formatErrors(error: HttpErrorResponse): Observable<any> {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
    }

    getListProducts(): Observable<any> {
        const url = `${ProductsService.BASE_URL}/product-management`;
        return this._http
            .get(url)
            .pipe(catchError((error) => this.formatErrors(error)));
    }

    consultarProducto(id: string): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management/${id}`;
        return this._http.get(query);
    }

    actualizarProducto(body: any, id: string): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management/${id}`;
        const data = body;
        return this._http.put(query, data);
    }

    subirArchivos(body: any): Observable<any> {
        const query = `${ProductsService.BASE_URL}/utils-management/uploads`;
        const data = body;
        return this._http.post(query, data);
    }

    eliminarProducto(id: string): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management/${id}`;
        return this._http.delete(query);
        // const url = `${ProductsService.BASE_URL}/product-management/${id}`;
        // const data = (await this._http.delete(url).toPromise()) as any;
        // return data;
    }

}
