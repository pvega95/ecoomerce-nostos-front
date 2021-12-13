import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { saleNoteRoutes } from 'app/modules/admin/sale-note/sale-note.routing';
import { SaleNoteComponent } from './sale-note.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IMaskModule } from 'angular-imask';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateEditSaleNoteComponent } from './create-edit-sale-note/create-edit-sale-note.component';

@NgModule({
    declarations: [
        SaleNoteComponent,
        CreateEditSaleNoteComponent,
    ],
    imports     : [
        RouterModule.forChild(saleNoteRoutes),
        MatFormFieldModule,
        IMaskModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatInputModule,
        TranslocoModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        NgApexchartsModule,
        SharedModule
    ]
})
export class SaleNoteModule
{
}
