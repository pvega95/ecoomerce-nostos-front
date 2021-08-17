import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CategoriesService } from './category.service';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';

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
  isLoading: boolean = true;
  searchInputControl: FormControl = new FormControl();
  selectedCategory: any = null;
  selectedCategoryForm: FormGroup;
  constructor(
    private fuseUtilsService: FuseUtilsService,
    private categoriesService: CategoriesService,
    private _formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.cargarLista();
    
  }
  initForm() {
    this.selectedCategoryForm = this._formBuilder.group({
        id               : [''],
        name             : ['', [Validators.required]],
        thumbnail        : [''],
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
            createdDate: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(categoryEncontrado.createdAt)),
            updatedDate: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(categoryEncontrado.updatedAt))
            
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
    return this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha))
  }


  closeDetails(): void
  {
      this.selectedCategory = null;
  }
  agregarNuevaCategoria(){

  }

  deleteSelectedCategory(){

  }
  updateSelectedCategory(){

  }
  crearNuevaCategoria(){

  }

}
