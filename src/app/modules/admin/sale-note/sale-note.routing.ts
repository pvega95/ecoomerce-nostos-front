import { Route } from '@angular/router';
import { SaleNoteComponent } from 'app/modules/admin/sale-note/sale-note.component';
import { CreateEditSaleNoteComponent } from './create-edit-sale-note/create-edit-sale-note.component';
import { SaleNoteListComponent } from './list/list.component';
import { SaleNoteListResolver } from './sale-note.resolvers';

export const saleNoteRoutes: Route[] = [
    {
        path     : '',
        component: SaleNoteComponent,
        resolve  : {
            saleNotes : SaleNoteListResolver
        },
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: SaleNoteListComponent,
            },
            {
                path     : 'new',
                component: CreateEditSaleNoteComponent,
            },
            {
                path     : 'edit/:id',
                component: CreateEditSaleNoteComponent,
            },
        ]
    }
];
