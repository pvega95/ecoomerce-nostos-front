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
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { CategoriesService } from '../category/category.service';


const MAX_CANT_DESCRIPCIONES = 4;

@Component({
    selector       : 'app-products',
    templateUrl    : './products.component.html',
    styles         : [
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
    animations     : fuseAnimations
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products: any[]=[];
    countDescripcion: number = 1;
    deshabilitarBotonAgregarDescripcion: boolean = false;
    deshabilitarBotonQuitarDescripcion: boolean = false;
    selected: number;

    brands: InventoryBrand[];
    categories: any[] = [];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = true;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any = null;
    selectedProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
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
        private _inventoryService: InventoryService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      this.cargarListaProductos();
      this.cargarCategorias();
        // Create the selected product form
        this.initForm();

        // Get the brands
        this._inventoryService.brands$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((brands: InventoryBrand[]) => {

                // Update the brands
                this.brands = brands;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the categories
        this._inventoryService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: InventoryCategory[]) => {

                // Update the categories
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

  

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

        // Get the vendors
        this._inventoryService.vendors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vendors: InventoryVendor[]) => {

                // Update the vendors
                this.vendors = vendors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    initForm() {
        this.selectedProductForm = this._formBuilder.group({
            id               : [''],
            category         : [''],
            name             : ['', [Validators.required]],
            descriptions     : this._formBuilder.array([]),
            createdDate      : [''],
            updatedDate      : [''],
            tags             : [[]],
            sku              : [''],
            barcode          : [''],
            brand            : [''],
            vendor           : [''],
            stock            : [''],
            reserved         : [''],
            cost             : [''],
            basePrice        : [''],
            taxPercent       : [''],
            price            : [''],
            weight           : [''],
            thumbnail        : [''],
            images           : [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active           : [false]
        });
    }

async cargarCategorias(){
        let resp: any;
        resp = await this.categoriesService.listarCategorias();
        if(resp.ok){
            // Get the products
            this.categories = resp.data;
            this.isLoading = false;
            console.log('lista categorias',resp.data);
        }

    }

    async cargarListaProductos(){
      let resp: any;
      // console.log('lista product', await this.productsService.listarProductos())
      resp = await this.productsService.listarProductos();
      if(resp.ok){
        // Get the products
        this.products = resp.data;
        this.isLoading = false;
      }
     }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
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

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
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
    toggleDetails(productId: string, open: boolean): void
    {
        console.log('selectedProduct', this.selectedProduct);

        // If the product is already selected...
        if (this.selectedProduct ) {
          if (this.selectedProduct._id === productId )
          {
              // Close the details
              this.closeDetails();
              return;
          }
        }
        this.initForm();
      

        // Get the product by id
        const productEncontrado = this.products.find(item => item._id === productId)  || null;
       
        this.selectedProduct = productEncontrado;
        if(productEncontrado._id){
            this.countDescripcion = productEncontrado.descriptions.length;
            this.verificarCantidadDescripciones();
            this.selectedProductForm.patchValue({
              id: productEncontrado._id,
              name: productEncontrado.name,
              descriptions: productEncontrado.descriptions.map(description =>{
                  return (this.selectedProductForm.get('descriptions') as FormArray).push(this.createDescriptionForm(description));
              }),
              sku: productEncontrado.sky,
              category: productEncontrado.category,
              stock: productEncontrado.stock,
              images: productEncontrado.image,
              price: (Math.round(productEncontrado.price * 100) / 100).toFixed(2),
              weight: (Math.round(productEncontrado.weight * 100) / 100).toFixed(2),
              createdDate: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(productEncontrado.createdAt)),
              updatedDate: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(productEncontrado.updatedAt))
              
            });

            this.selected = this.categories.findIndex(categoria => categoria._id === this.selectedProductForm.get('category').value)

        }else{
            let descriptions = ['']
            this.selected = -1;
            this.selectedProductForm.patchValue({
                id: -1,
                name: '',
                descriptions:  descriptions.map(description =>{
                    return (this.selectedProductForm.get('descriptions') as FormArray).push(this.createDescriptionForm(description));
                }),
                sku: '',
                category: '',
                stock: '',
                images: '',
                price: '',
                weight: '',
                createdDate: '',
                updatedDate: ''
                
              });

        }
  
    }
    createDescriptionForm(description?: string){
        return this._formBuilder.group({
            description: description || ''
        })
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedProduct = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void
    {
        // Get the image count and current image index
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex = this.selectedProductForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no tag available...
        if ( this.filteredTags.length === 0 )
        {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.selectedProduct.tags.find(id => id === tag.id);

        // If the found tag is already applied to the product...
        if ( isTagApplied )
        {
            // Remove the tag from the product
            this.removeTagFromProduct(tag);
        }
        else
        {
            // Otherwise add the tag to the product
            this.addTagToProduct(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title
        };

        // Create tag on the server
        this._inventoryService.createTag(tag)
            .subscribe((response) => {

                // Add the tag to the product
                this.addTagToProduct(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: InventoryTag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._inventoryService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: InventoryTag): void
    {
        // Delete the tag from the server
        this._inventoryService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the product
     *
     * @param tag
     */
    addTagToProduct(tag: InventoryTag): void
    {
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
    removeTagFromProduct(tag: InventoryTag): void
    {
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
     toggleProductCategory(category: any, index: number, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.selectedProductForm.patchValue({
                category: category._id
            });
            this.selected = index;
        }
        else
        {
            this.selectedProductForm.patchValue({
                category: ''
            });
        } 
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Create product
     */
     agregarNuevoProducto(): void
    {
        this.products.unshift({
            name: 'Nuevo producto'
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
    updateSelectedProduct(): void
    {
        // Get the product object
        const product = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;

        // Update the product on the server
        this._inventoryService.updateProduct(product.id, product).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    crearNuevoProducto(): void{
        this. sacarListaDescripcionesDesdeForm();
        const body = {
            sky: this.selectedProductForm.controls.sku.value,
            name: this.selectedProductForm.controls.name.value,
            price: this.selectedProductForm.controls.price.value,
            weight: this.selectedProductForm.controls.weight.value,
            descriptions: this.sacarListaDescripcionesDesdeForm(),
            thumbnail: '',
            image: [],
            category: '',
            options: '',
            stock: this.selectedProductForm.controls.stock.value
        }
        console.log('body creanr producto nuevo',body)
      //  this.productsService.crearProducto(body);
    }
    sacarListaDescripcionesDesdeForm(): string[]{
        let cadena: string[] = [];
        (this.selectedProductForm.get('descriptions') as FormArray).value.forEach(element => {
            cadena.push(element.description)
        });
        return cadena;
    }
    agregarDescripcion(): void{
        this.countDescripcion++;
        if(this.verificarCantidadDescripciones()){
            this.selectedProductForm.patchValue({
                descriptions:  (this.selectedProductForm.get('descriptions') as FormArray).push(this.createDescriptionForm())
            });
        }
       // console.log('cantidad de descri', (this.selectedProductForm.get('descriptions') as FormArray).length)
  
        
    }
    quitarDescripcion(): void{
        this.countDescripcion--;
        if(this.verificarCantidadDescripciones()){
            (this.selectedProductForm.get('descriptions') as FormArray).removeAt((this.selectedProductForm.get('descriptions') as FormArray).length - 1)
        }
        
    }
    verificarCantidadDescripciones(): boolean{
        if( this.countDescripcion <= MAX_CANT_DESCRIPCIONES && this.countDescripcion >= 1){
            this.deshabilitarBotonQuitarDescripcion = false;
            if(this.countDescripcion === MAX_CANT_DESCRIPCIONES){
                this.deshabilitarBotonAgregarDescripcion = true;
            }else{
                if(this.countDescripcion === 1){
                    this.deshabilitarBotonQuitarDescripcion = true;
                }
                this.deshabilitarBotonAgregarDescripcion = false;
            }
            
            return true;
        }else{
            if(this.countDescripcion > 4){
                this.countDescripcion = MAX_CANT_DESCRIPCIONES;
                this.deshabilitarBotonAgregarDescripcion = true;
            }else{
                if(this.countDescripcion < 1){
                    this.countDescripcion = 1;
                    this.deshabilitarBotonQuitarDescripcion = true;
                }
            }
            
            return false;
        }
    }
    subirImagen(): void{

    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Eliminar producto',
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
            if ( result === 'confirmed' )
            {

                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                this._inventoryService.deleteProduct(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
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
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
