import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrandService } from '../../brand/brand.service';
import { CategoriesService } from '../../category/category.service';
import { UnidService } from '../../unid/unid.service';
import { ProductsService } from '../products.service';

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
    categories: any[];
    units: any[];
    brands: any[];

    productForm: FormGroup;
    sku: FormControl;
    name: FormControl;
    descriptions: FormArray;
    category: FormControl;
    brand: FormControl;
    unid: FormControl;
    listprice: FormControl;
    discount: FormControl;
    stock: FormControl;
    images: FormArray;

    files: File[] = [];
    constructor(
        private cd: ChangeDetectorRef,
        public dialogRef: MatDialogRef<ProductAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _categoriesService: CategoriesService,
        private _unidService: UnidService,
        private _brandService: BrandService,
        private _productsService: ProductsService,
        private fb: FormBuilder
    ) {
        this.createValidators();
        this.createForm();
    }

    ngOnInit(): void {
        this.cargarCategorias();
        this.cargarUnidades();
        this.cargarMarcas();
        const { idProduct } = this.data;
        if (idProduct) {
            this.cargarProducto(idProduct);
        }
    }

    cargarProducto(id: string): void {
        console.log('cargarProducto', id);
        this._productsService.consultarProducto(id).subscribe((response) => {
            const producto = response.data[0];
            this.patchForm(producto);
        });
    }

    async patchForm(producto): Promise<void> {
        const { images } = producto;
        if (images) {
            const filesTemp = [];
            for (const image of images) {
                this.addImageControl(image);
                filesTemp.push(await this.onImageEdit(image.imageURL));
            }
            this.files = filesTemp;
        }
        this.productForm.patchValue(producto);
    }

    createImageForm(): FormControl {
        return new FormControl();
    }

    addImageControl(image: any): void {
        const imageProduct = this.createImageForm();
        if (image) {
            imageProduct.patchValue(image);
        }
        this.images.insert(0, imageProduct);
    }

    cargarMarcas(): void {
        this._brandService.listarMarca().subscribe((response) => {
            if (response.ok) {
                this.brands = response.data;
            }
        });
    }

    cargarUnidades(): void {
        this.units = [];
        this._unidService.listarUnidad().subscribe((response) => {
            if (response.ok) {
                this.units = response.data;
            }
        });
    }

    cargarCategorias(): void {
        this.categories = [];
        this._categoriesService.listarCategorias().subscribe((categories) => {
            if (categories.ok) {
                this.categories = categories.data;
            }
        });
    }

    cancel(): void {
        this.dialogRef.close({});
    }

    getFilesLoades(images): void {
        const imagesBK = [...images];
        for (let i = 0, len = images.length; i < len; i++) {
            const existImage = this.images.value.findIndex(
                img => img.imageURL.split('/').reverse()[0] === images[i].name
            );
            if (existImage > -1) {
                imagesBK.splice(existImage, 1);
            }
        }
        this.clearFormArray(this.images);
        imagesBK.forEach((img) => {
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
        const { idProduct } = this.data;
        // console.log('productForm', this.productForm.value);
        this.dialogRef.close({
            productForm: this.productForm.value,
            idProduct: idProduct,
        });
    }

    public onImageEdit = async (imgUrl): Promise<File> => {
        const originalName = imgUrl.split('/').reverse()[0];
        // var imgExt = this.getUrlExtension(imgUrl);

        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const file = new File([blob], originalName, {
            type: blob.type,
        });

        return file;
    };

    private createForm(): void {
        this.productForm = this.fb.group({
            sku: this.sku,
            name: this.name,
            descriptions: this.descriptions,
            category: this.category,
            brand: this.brand,
            unid: this.unid,
            listprice: this.listprice,
            discount: this.discount,
            stock: this.stock,
            images: this.images,
        });
    }

    private createValidators(): void {
        this.sku = new FormControl();
        this.name = new FormControl();
        this.descriptions = new FormArray([
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

    // public getUrlExtension = (url) => {
    //     return url.split(/[#?]/)[0].split('.').pop().trim();
    // };
}
