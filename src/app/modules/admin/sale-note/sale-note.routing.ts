import { Route } from '@angular/router';
import { SaleNoteComponent } from 'app/modules/admin/sale-note/sale-note.component';

export const saleNoteRoutes: Route[] = [
    {
        path     : '',
        component: SaleNoteComponent,
    }
];
