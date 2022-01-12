import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { VoucherDetail } from 'app/models/voucher-detail';
import { SaleNote } from 'app/models/sale-note';
import { SaleNoteService } from '../sale-note.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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
            .mat-column-client {
                width: 25% !important;
              }
            .mat-column-document {
                width: 15% !important;
             }
            .mat-column-serie {
                width: 10% !important;
              }
            .mat-column-documentnumber {
                width: 16% !important;
            }
            .mat-column-salestotal {
                width: 18% !important;
                text-align: right !important;
            }
            .mat-column-actions {
                width: 16% !important;
            }
            .header-align-right{
                ::ng-deep .mat-sort-header-container {
                    display:flex;
                    justify-content:end;
                  }
              }
            .header-align-center{
                ::ng-deep .mat-sort-header-container {
                    display:flex;
                    justify-content:center;
                  }
              }

            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 5rem 112px auto 3rem 72px;
                }

                @screen lg {
                    grid-template-columns: 5rem 112px auto 3rem 96px 96px 72px;
                }
            }
  

            .editIcon:hover{
                color: blue !important;
            }
            .deleteIcon:hover{
                color: red !important;
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
    searchInputControlClient: FormControl = new FormControl();
    searchInputControlStatus: FormControl = new FormControl();
    isLoading: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private saleNoteService: SaleNoteService,
        private router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit(): void {
        this.loadListSaleNote();
        this.searchInputControlClient.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((queryInput) => {
                this.isLoading = true;
                const query = (queryInput as string).toLowerCase();
              return this.recentTransactionsDataSource.data = this.salesNotes.filter((salesNote)=>{
                    return (salesNote.client as string).toLowerCase().match(query) 
               });
            }),
            map(() => {
                this.isLoading = false;
            })
        )
        .subscribe(); 

    }

    loadListSaleNote(): void {
        // Get the courses
        this.saleNoteService.saleNotes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: any) => {
                this.salesNotes = resp.data;
                this.recentTransactionsDataSource.data = this.salesNotes;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    editSaleNote(id: string): void {
        this.router.navigate([`/salenote/edit/${id}`]);
    }

    deleteSaleNote(id: string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar Nota Venta',
            message:
                '¿Estás seguro(a) de eliminar esta nota venta? Esta acción no puede deshacerse!',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.saleNoteService.deleteSaleNote(id).subscribe((resp) => {
                    if(resp.ok) {
                        this.saleNoteService.getListSaleNote().pipe(take(1)).subscribe();
                    }
                });
            }
        });
    }
}
