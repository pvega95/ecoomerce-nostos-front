import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { CompanyService } from '../setting/company/company.service';
import { DocumentService } from '../setting/document/document.service';
import { PaymentDeadlineService } from '../setting/payment-deadline/payment-deadline.service';
import { ProductsService } from '../setting/products/products.service';
import { SaleNoteService } from './sale-note.service';

@Injectable({
    providedIn: 'root',
})
export class SaleNoteListResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _saleNoteService: SaleNoteService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any[]> {
        return this._saleNoteService.getListSaleNote();
    }
}

@Injectable({
    providedIn: 'root',
})
export class SaleNoteInitialDataResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private companyService: CompanyService,
        private documentService: DocumentService,
        private paymentDeadlineService: PaymentDeadlineService,
        private productsService: ProductsService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any[]> {
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
            this.companyService.getListCompany(),
            this.documentService.getListDocument(),
            this.paymentDeadlineService.getListPaymentDeadline(),
            this.productsService.getListProducts(),
        ]);
    }
}
