import { ProductsService } from './products.service';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    FormControl,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ProductPresenter } from './products.presenter';
import { isArray } from 'lodash-es';
import { Product } from 'app/models/product';
import { MatTableDataSource } from '@angular/material/table';
import { ProductAddComponent } from './product-add/product-add.component';
@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    styles: [
        /* language=SCSS */
        `
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
    animations: fuseAnimations,
    providers: [ProductPresenter],
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    recentTransactionsTableColumns: string[] = [
        'thumb',
        'sku',
        'name',
        'description',
        'category',
        'brand',
        'actions',
    ];

    products: any[] = [];
    productsFiltered: any[] = [];
    isLoading: boolean;
    searchInputControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private productsService: ProductsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        public dialog: MatDialog,
        public presenter: ProductPresenter
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.cargarListaProductos();
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((queryInput: string) => {
                    this.isLoading = true;
                    const query = queryInput.toLowerCase();
                    return (this.productsFiltered = this.products.filter(
                        (product) =>
                            product.name.toLowerCase().match(query) ||
                            product.sku.toLowerCase().match(query) ||
                            product.price.toLowerCase().match(query)
                    ));
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    async cargarListaProductos(): Promise<void> {
        this.products = [];
        // console.log('lista product', await this.productsService.listarProductos())
        this.isLoading = true;
        const resp = await this.productsService.listarProductos();
        if (resp.ok) {
            // Get the products
            this.products = resp.data;
            this.productsFiltered = this.products;
            this.isLoading = false;
            this.recentTransactionsDataSource.data = this.products;
            console.log(' this.products ', this.products);
        }
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._paginator.pageIndex = 0;
                });
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create product
     */
    agregarNuevoProducto(): void {
        this.productModal();
    }

    editProduct(idProduct: string): void {
        this.productModal(idProduct);
    }

    /**
     * Update the selected product using the form data
     * @param id
     */
    async updateSelectedProduct(id): Promise<void> {
        this.isLoading = true;
        let resp;
        // Get the product object
        const product = this.presenter.form.value;
        if (product.images.length > 0) {
            product.images = product.images.filter(
                (img) => img instanceof File
            );
            resp = await this.productsService.actualizarProducto(
                this.toFormData(product),
                id
            );
        } else {
            resp = await this.productsService.actualizarProducto(product, id);
        }

        if (resp.success) {
            this.isLoading = false;
            setTimeout(() => {
                // 3 segundo se cierra modal
            }, 2000);

            setTimeout(() => {
                this.cargarListaProductos();
            }, 1000);
        }
    }

    crearNuevoProducto(product): void {
        const productForm = new Product(product);
        this.isLoading = true;
        this.productsService
            .crearProducto(this.toFormData(productForm))
            .subscribe((resp) => {
                this.dialog.closeAll();
                if (resp.ok) {
                    this.isLoading = false;
                    setTimeout(() => {
                        this.cargarListaProductos();
                    }, 1000);
                }
            });
    }

    toFormData<T>(formValue: T): FormData {
        const formData = new FormData();

        for (const key of Object.keys(formValue)) {
            if (
                key === 'images' ||
                (key === 'descriptions' && isArray(formValue[key]))
            ) {
                for (const f of formValue[key]) {
                    formData.append(key, f);
                }
            } else {
                const value = formValue[key];
                formData.append(key, value);
            }
        }

        return formData;
    }
    /**
     * Delete the selected product using the form data
     */
    deleteProduct(idProduct: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar producto',
            message:
                '¿Estás seguro(a) de eliminar este producto? Esta acción no puede deshacerse!',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe(async (result) => {
            let resp;
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the product object
                this.isLoading = true;
                resp = await this.productsService.eliminarProducto(idProduct);
                if (resp.success) {
                    this.isLoading = false;
                    setTimeout(() => {
                        this.presenter.resetProductForm();
                        this.cargarListaProductos();
                    }, 1000);
                }
            }
        });
    }

    productModal(idProduct?: string): void {
        const dialogRef = this.dialog.open(ProductAddComponent, {
            data: {
                idProduct: idProduct || null
            },
            panelClass: 'my-custom-dialog-class',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // this.crearNuevoProducto(result);
            }
        });
    }
}
