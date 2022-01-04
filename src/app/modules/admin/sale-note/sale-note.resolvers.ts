import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SaleNoteService } from "./sale-note.service";

@Injectable({
    providedIn: 'root'
})
export class SaleNoteListResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _saleNoteService: SaleNoteService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        return this._saleNoteService.getListSaleNote();
    }
}