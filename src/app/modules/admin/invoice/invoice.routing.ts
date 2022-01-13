import { Route } from '@angular/router';
import { SaleNoteComponent } from 'app/modules/admin/sale-note/sale-note.component';
import { CreateEditSaleNoteComponent } from './create-edit-invoice/create-edit-sale-note.component';
import { InvoiceComponent } from './printable/invoice.component';
import { SaleNoteListComponent } from './list/list.component';
import { SaleNoteInitialDataResolver, SaleNoteListResolver } from './sale-note.resolvers';

export const saleNoteRoutes: Route[] = [
    {
        path     : '',
        component: SaleNoteComponent,
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: SaleNoteListComponent,
                resolve  : {
                    saleNotes : SaleNoteListResolver
                },
            },
            {
                path     : 'new',
                component: CreateEditSaleNoteComponent,
                resolve    : {
                    saleNoteInitalData: SaleNoteInitialDataResolver,
                },
            },
            {
                path     : 'edit/:id',
                component: CreateEditSaleNoteComponent,
                resolve    : {
                    saleNoteInitalData: SaleNoteInitialDataResolver,
                },
            },
            {
                path     : 'print/:id',
                component: InvoiceComponent
            },
        ]
    }
];
