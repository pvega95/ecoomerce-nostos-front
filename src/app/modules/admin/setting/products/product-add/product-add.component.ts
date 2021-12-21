import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent {

    productForm: FormGroup;
    sku: FormControl;
    name: FormControl;
    description: FormArray;
    category: FormControl;
    brand: FormControl;
    unit: FormControl;
    listPrice: FormControl;
    discount: FormControl;
    stock: FormControl;
    images: FormArray;

    constructor(
        public dialogRef: MatDialogRef<ProductAddComponent>,
        private fb: FormBuilder
    ) {
        this.createValidators();
        this.createForm();
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
            name: this.sku,
            description: this.description,
            category: this.category,
            brand: this.brand,
            unit: this.unit,
            listPrice: this.listPrice,
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
        this.unit = new FormControl();
        this.listPrice = new FormControl();
        this.discount = new FormControl();
        this.stock = new FormControl();
        this.images = new FormArray([]);
    }
}
