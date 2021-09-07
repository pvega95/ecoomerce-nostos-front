import { ProductsService } from './products.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { CategoriesService } from '../category/category.service';
import { WindowModalComponent } from '../../../../shared/window-modal/window-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductPresenter } from './products.presenter';
import { isArray } from 'lodash-es';
import { Product } from 'app/models/product';
import { Modal } from '../../../../enums/modal.enum';

const NEW_PRODUCT = -1;
const MAX_CANT_DESCRIPCIONES = 4;

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
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
        `
    ],
    animations: fuseAnimations,
    providers: [ProductPresenter],
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products: any[] = [];
    countDescripcion: number = 1;
    deshabilitarBotonAgregarDescripcion: boolean = false;
    deshabilitarBotonQuitarDescripcion: boolean = false;
    selected: number;
    files: File[] = [];
    filePaths: String[] = [];


    categories: any[] = [];

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = true;

    searchInputControl: FormControl = new FormControl();
    selectedProduct: any = null;
    selectedProductForm: FormGroup;

    tagsEditMode: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private fuseUtilsService: FuseUtilsService,
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        public presenter: ProductPresenter
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.cargarListaProductos();
        this.cargarCategorias();
        // Create the selected product form
        this.initForm();



        // Get the tags
        /*        this._inventoryService.tags$
                   .pipe(takeUntil(this._unsubscribeAll))
                   .subscribe((tags: InventoryTag[]) => {
       
                       // Update the tags
                       this.tags = tags;
                       this.filteredTags = tags;
       
                       // Mark for check
                       this._changeDetectorRef.markForCheck();
                   }); */


    }

    initForm() {
        
        this.selectedProductForm = this._formBuilder.group({
            id: [''],
            category: [''],
            name: ['', [Validators.required]],
            descriptions: this._formBuilder.array([]),
            createdDate: [''],
            updatedDate: [''],
            tags: [[]],
            sku: [''],
            barcode: [''],
            brand: [''],
            vendor: [''],
            stock: [''],
            reserved: [''],
            cost: [''],
            basePrice: [''],
            taxPercent: [''],
            price: [''],
            weight: [''],
            thumbnail: [''],
            images: [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active: [false]
        });
    }

    async cargarCategorias() {
        let resp: any;
        resp = await this.categoriesService.listarCategorias();
        if (resp.ok) {
            // Get the categories
            this.categories = resp.data;
            this.isLoading = false;
            console.log('lista categorias', resp.data);
        }

    }

    async cargarListaProductos() {
        let resp: any;
        // console.log('lista product', await this.productsService.listarProductos())
        resp = await this.productsService.listarProductos();
        if (resp.ok) {
            // Get the products
            this.products = resp.data;
            this.isLoading = false;
            console.log(' this.products ',  this.products )
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
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
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
     * Toggle product details
     *
     * @param productId
     */
    toggleDetails(productId: string, open: boolean): void {
        this.filePaths = [];
        // If the product is already selected...
        if (this.selectedProduct) {
            if (this.selectedProduct._id === productId) {
                // Close the details
                this.presenter.resetProductForm();
                this.closeDetails();
                return;
            }
        }

        // Get the product by id
        const productEncontrado = this.products.find(item => item._id === productId) || null;
        productEncontrado.currentImageIndex = 0;
        this.selectedProduct = productEncontrado;
        if (productEncontrado._id) {
            this.presenter.loadProductForm(productEncontrado);
            const { images } = productEncontrado;
            if (images.length > 0) {
                images.map(img => this.filePaths.push(img.imageURL))
            }

        } else {
            this.presenter.resetProductForm();
        }

    }




    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void {
        // Get the image count and current image index
        // const count = this.selectedProductForm.get('images').value.length;
        // const currentIndex = this.selectedProductForm.get('currentImageIndex').value;
        const count = this.presenter.form.get('images').value.length;
        const currentIndex = this.presenter.form.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if (forward) {
            // this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
            this.presenter.form.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else {
            // this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
            this.presenter.form.get('currentImageIndex').setValue(prevIndex);

        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags

    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void {

    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void {

    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag, event): void {
        // Update the title on the tag
        tag.title = event.target.value;


    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag): void {

    }

    /**
     * Add tag to the product
     *
     * @param tag
     */
    addTagToProduct(tag): void {
        // Add the tag
        this.selectedProduct.tags.unshift(tag.id);

        // Update the selected product form
        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the product
     *
     * @param tag
     */
    removeTagFromProduct(tag): void {
        // Remove the tag
        this.selectedProduct.tags.splice(this.selectedProduct.tags.findIndex(item => item === tag.id), 1);

        // Update the selected product form
        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle product tag
     *
     * @param tag
     * @param change
     */
    toggleProductCategory(category: any, index: number, change: MatCheckboxChange): void {
        console.log(change);
        if (change.checked) {
            this.presenter.form.patchValue({
                category: category._id
            });
            this.selected = index;
        }
        else {
            this.presenter.form.patchValue({
                category: ''
            });
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean {
        return false;
    }

    /**
     * Create product
     */
    agregarNuevoProducto(): void {
        this.products.unshift({
            name: 'Nuevo producto',
            thumbnail: null
        });
        this.selected = -1;
        /*   // Create the product
          this._inventoryService.createProduct().subscribe((newProduct) => {
  
              // Go to new product
              this.selectedProduct = newProduct;
  
              // Fill the form
              this.selectedProductForm.patchValue(newProduct);
  
              // Mark for check
              this._changeDetectorRef.markForCheck();
          }); */
    }

    /**
     * Update the selected product using the form data
     */
    updateSelectedProduct(): void {
        // Get the product object
        const product = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;


    }

    crearNuevoProducto(): void {
        console.log('presenter', this.presenter.form.value);
        const productForm = new Product(this.presenter.form.value);
        this.productsService.crearProducto(this.toFormData(productForm)).then((resp)=>{
            console.log('resp', resp)
            this.dialog.closeAll();

        }); 
    }

    toFormData<T>(formValue: T) {
        const formData = new FormData();

        for (const key of Object.keys(formValue)) {
            if (key === 'images' || key === 'descriptions' && isArray(formValue[key])) {
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

    sacarListaDescripcionesDesdeForm(): string[] {
        let cadena: string[] = [];
        (this.selectedProductForm.get('descriptions') as FormArray).value.forEach(element => {
            cadena.push(element.description)
        });
        return cadena;
    }
    agregarDescripcion(): void {
        this.countDescripcion++;
        if (this.verificarCantidadDescripciones()) {
            this.presenter.addDescriptionControl();
     /*     this.selectedProductForm.patchValue({
                descriptions: (this.selectedProductForm.get('descriptions') as FormArray).push(this.createDescriptionForm())
            }); */
        } 
       
     //   console.log('descriptions', this.selectedProductForm.get('descriptions').value);


    }
    quitarDescripcion(): void {
        this.countDescripcion--;
        if (this.verificarCantidadDescripciones()) {
            this.presenter.removeDescriptionControl();
           // (this.selectedProductForm.get('descriptions') as FormArray).removeAt((this.selectedProductForm.get('descriptions') as FormArray).length - 1)
        }

    }
    verificarCantidadDescripciones(): boolean {
        if (this.countDescripcion <= MAX_CANT_DESCRIPCIONES && this.countDescripcion >= 1) {
            this.deshabilitarBotonQuitarDescripcion = false;
            if (this.countDescripcion === MAX_CANT_DESCRIPCIONES) {
                this.deshabilitarBotonAgregarDescripcion = true;
            } else {
                if (this.countDescripcion === 1) {
                    this.deshabilitarBotonQuitarDescripcion = true;
                }
                this.deshabilitarBotonAgregarDescripcion = false;
            }

            return true;
        } else {
            if (this.countDescripcion > 4) {
                this.countDescripcion = MAX_CANT_DESCRIPCIONES;
                this.deshabilitarBotonAgregarDescripcion = true;
            } else {
                if (this.countDescripcion < 1) {
                    this.countDescripcion = 1;
                    this.deshabilitarBotonQuitarDescripcion = true;
                }
            }

            return false;
        }
    }
    openModalUploadImages(): void {
        const dialogRef = this.dialog.open(WindowModalComponent, {
            width: '42rem',
            height: '23rem',
            data: {
                type: Modal.imagesUploader
            },
        disableClose: true
        });

        dialogRef.afterClosed().subscribe(async result => {
            console.log('result', result);
            if (result) {
                this.presenter.addImages(result);
                result.forEach(file => {
                    this.fuseUtilsService.readImageFile(file)
                        .then((img: string) => setTimeout(() => {
                            this.filePaths.push(img)
                        }))
                        .catch(err => console.error(err));
                });

                //   if (this.selectedProductForm.controls.id.value === NEW_PRODUCT){
                //     this.files = (result as File[]);
                //     this.files.forEach(file => {
                // this.fuseUtilsService.readImageFile(file)
                //         .then(img => setTimeout(() => {        
                //             listImgs.push(img as string)       
                //         }))
                //         .catch(err => console.error(err));
                //     });
                //    this.selectedProductForm.patchValue({
                //         images: listImgs
                //     }); 

                //   }

            } else {
                console.log('indefinido')
            }

        });

    }

    removeImages(): void {
        this.selectedProductForm.patchValue({
            images: [],
            currentImageIndex: 0
        });
        this.files = [];
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar producto',
            message: '¿Estás seguro(a) de eliminar este producto? Esta acción no puede deshacerse!',
            actions: {
                confirm: {
                    label: 'Eliminar'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {

                // Get the product object
                const product = this.selectedProductForm.getRawValue();


            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
