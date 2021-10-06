import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CategoriesService } from './category.service';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: [
          `
          .inventory-grid {
              grid-template-columns: 48px auto 40px;

              @screen sm {
                  grid-template-columns: 48px auto 112px 72px;
              }

              @screen md {
                  grid-template-columns: 14rem 10rem 10rem 13rem 8rem;
              }

              @screen lg {
                  grid-template-columns: 14rem 10rem 10rem 13rem 8rem;
              }
          }
      `
  ],
  animations     : fuseAnimations
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  categoriesFiltered: any[] = [];
  isLoading: boolean = true;
  searchInputControl: FormControl = new FormControl();
  selectedCategory: any = null;
  selectedCategoryForm: FormGroup;
  flashMessage: boolean;
  seeMessage: boolean = false;
  successMessage: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private fuseUtilsService: FuseUtilsService,
    private categoriesService: CategoriesService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }

  ngOnInit(): void {
    this.successMessage = '';
    this.cargarLista();
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            this.closeDetails();
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.categoriesFiltered = this.categories.filter((category)=>{
                return (category.name as string).toLowerCase().match(query) || (category.thumbnail as string).toLowerCase().match(query) 
                 
           });
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe(); 

  }
  initForm() {
    this.selectedCategoryForm = this._formBuilder.group({
        id               : [''],
        name             : ['', [Validators.required, FuseUtilsService.sinEspaciosEnBlanco]],
        thumbnail        : ['', [Validators.required, FuseUtilsService.sinEspaciosEnBlanco]],
        createdDate      : [''],
        updatedDate      : ['']
    });
}
  async cargarLista(){
    let resp: any;
    resp = await this.categoriesService.listarCategorias();
    if(resp.ok){
      // Get the products
      this.categories = resp.data;
      this.categoriesFiltered = this.categories;
      this.isLoading = false;
      console.log('lista categorias',resp.data);
    }


  }

  toggleDetails(categoryId: string, open: boolean): void
  {
      console.log('selectedCategory', this.selectedCategory);

      // If the category is already selected...
      if (this.selectedCategory ) {
        if (this.selectedCategory._id === categoryId )
        {
            // Close the details
            this.closeDetails();
            return;
        }
      }
      this.successMessage = '';
      this.seeMessage = false;
      this.initForm();
    

      // Get the category by id
      const categoryEncontrado = this.categories.find(item => item._id === categoryId)  || null;
      console.log('categoryEncontrado', categoryEncontrado)
      this.selectedCategory = categoryEncontrado;
      if(categoryEncontrado._id){
          
          this.selectedCategoryForm.patchValue({
            id: categoryEncontrado._id,
            name: categoryEncontrado.name,
            thumbnail: categoryEncontrado.thumbnail,
            createdDate: categoryEncontrado.createdAt !== '' ?  this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(categoryEncontrado.createdAt)) : '',
            updatedDate: categoryEncontrado.updatedAt !== '' ? this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(categoryEncontrado.updatedAt)) : ''
            
          });

      }else{
          this.selectedCategoryForm.patchValue({
              id: -1,
              name: '',
              sku: '',
              barcode: '',
              stock: '',
              images: '',
              price: '',
              weight: '',
              createdDate: '',
              updatedDate: ''
              
            });

      }

  }
  formatoFecha(fecha: string): string{
    return  fecha !== '' ? this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha)) : ''
  }


  closeDetails(): void
  {
      this.selectedCategory = null;
  }
  agregarNuevaCategoria(){
    this.categories.unshift({
      name: '',
      thumbnail: '',
      createdAt: '',
      updatedAt: ''
    });

  }

  deleteSelectedCategory(){
    const confirmation = this._fuseConfirmationService.open({
      title  : 'Eliminar categoria',
      message: '¿Estás seguro(a) que quieres eliminar esta categoria?. Esta acción no puede deshacerse!',
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

          // Delete the product on the server
     /*      this._inventoryService.deleteProduct(product.id).subscribe(() => {

              // Close the details
              this.closeDetails();
          }); */
      }
  });
  }
  updateSelectedCategory(){

  }
  crearNuevaCategoria(){
    if (this.selectedCategoryForm.valid) {
      const body = {
        name: this.selectedCategoryForm.get('name').value,
        thumbnail: (this.selectedCategoryForm.get('thumbnail').value as string).toLocaleUpperCase(),
      }
      this.isLoading = true;
      this.categoriesService.crearCategoria(body).then((resp)=>{
        this.flashMessage = resp.ok;
        this.seeMessage = true;
 
        if (resp.ok) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra 
                this.seeMessage = false;
                }, 2000);

            setTimeout(()=>{  
                this.cargarLista();
                this.closeDetails();
                }, 1000); 
            
        }
      });

    }


  }

}
