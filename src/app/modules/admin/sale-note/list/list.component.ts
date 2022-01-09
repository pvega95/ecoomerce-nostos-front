import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { VoucherDetail } from 'app/models/voucher-detail';
import { SaleNote } from 'app/models/sale-note';
import { SaleNoteService } from '../sale-note.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

const createLabel = ' (Nueva)';
const editLabel = ' (Editar)';

@Component({
    selector: 'sale-note-list',
    templateUrl: './list.component.html',
    // encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        /* language=SCSS */
        `
        :host ::ng-deep {
            table {
                &.mat-table {
                    tbody {
                        background-color: white;
                    }
                }
            }
        }

            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
})
export class SaleNoteListComponent implements OnInit {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    recentTransactionsTableColumns: string[] = [
        'client',
        'document',
        'serie',
        'documentnumber',
        'salestotal',
        'actions',
    ];

    public salesNotes: SaleNote[];
    public salesNotesFiltered: SaleNote[] = [];
    searchInputControl: FormControl = new FormControl();
    isLoading: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private saleNoteService: SaleNoteService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadListSaleNote();
    }

    loadListSaleNote(): void {

        // Get the courses
        this.saleNoteService.saleNotes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: any) => {
                console.log(resp);
                this.salesNotes = this.salesNotesFiltered = resp.data;
                this.recentTransactionsDataSource.data = this.salesNotes;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

}
