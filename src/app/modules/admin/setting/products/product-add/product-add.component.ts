import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrandService } from '../../brand/brand.service';
import { CategoriesService } from '../../category/category.service';
import { UnidService } from '../../unid/unid.service';
import { ProductsService } from '../products.service';

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit{

    categories: any[];
    units: any[];
    brands: any[];

    productForm: FormGroup;
    sku: FormControl;
    name: FormControl;
    description: FormArray;
    category: FormControl;
    brand: FormControl;
    unid: FormControl;
    listprice: FormControl;
    discount: FormControl;
    stock: FormControl;
    images: FormArray;

    constructor(
        public dialogRef: MatDialogRef<ProductAddComponent>,
        private _categoriesService: CategoriesService,
        private _unidService: UnidService,
        private _brandService: BrandService,
        private fb: FormBuilder
    ) {
        this.createValidators();
        this.createForm();
    }

    ngOnInit(){
        this.cargarCategorias();
        this.cargarUnidades();
        this.cargarMarcas();
    }

    cargarMarcas(){
        this._brandService.listarMarca().subscribe((response)=> {
            if(response.ok){
                this.brands = response.data;
            }
        })
    }

    cargarUnidades(){
        this.units = [];
        this._unidService.listarUnidad().subscribe((response)=> {
            if(response.ok){
                this.units = response.data;
            }
        })
    }

    cargarCategorias(): void {
        this.categories = [];
        this._categoriesService.listarCategorias().subscribe((categories) => {
            if (categories.ok) {
                this.categories = categories.data;
                console.log('categories', this.categories);
            }
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }

    getFilesLoades(images): void {
        this.clearFormArray(this.images);
        images.forEach((img) => {
            const imageControl = new FormControl(img);
            this.images.push(imageControl);
        });
    }

    clearFormArray(formArray: FormArray): void {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
          }
    }

    submitForm(): void {
        this.dialogRef.close(this.productForm.value);
    }

    private createForm(): void {
        this.productForm = this.fb.group({
            sku: this.sku,
            name: this.name,
            description: this.description,
            category: this.category,
            brand: this.brand,
            unid: this.unid,
            listprice: this.listprice,
            discount: this.discount,
            stock: this.stock,
            images: this.images
        });
    }

    private createValidators(): void {
        this.sku = new FormControl();
        this.name = new FormControl();
        this.description = new FormArray([
            new FormControl(),
            new FormControl(),
            new FormControl(),
        ]);
        this.category = new FormControl();
        this.brand = new FormControl();
        this.unid = new FormControl();
        this.listprice = new FormControl();
        this.discount = new FormControl();
        this.stock = new FormControl();
        this.images = new FormArray([]);
    }
}
