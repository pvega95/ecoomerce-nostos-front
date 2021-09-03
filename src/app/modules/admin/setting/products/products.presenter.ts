import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Injectable()
export class ProductPresenter {
    form: FormGroup;
    images: FormArray;
    sku: FormControl;
    name: FormControl;
    price: FormControl;
    weight: FormControl;
    descriptions: FormArray;
    thumbnail: FormControl;
    category: FormControl;
    options: FormControl;
    stock: FormControl;
    createdDate: FormControl;
    updatedDate: FormControl;
    id: FormControl;
    currentImageIndex: FormControl;

    constructor(protected fb: FormBuilder) {
        console.log('ProductPresenter');
        this.createValidators();
        this.createForm();
    }

    get descriptionsForm() {
        return this.form.get('descriptions') as FormArray;
    }

    get descriptionsControls() {
        return this.descriptionsForm.controls as FormGroup[];
    }

    get currentImageIdx(){
        return this.form.get('currentImageIndex').value
    }

    createForm(): void {
        this.form = this.fb.group({
            id: this.id,
            images: this.images,
            sku: this.sku,
            name: this.name,
            price: this.price,
            weight: this.weight,
            descriptions: this.descriptions,
            thumbnail: this.thumbnail,
            category: this.category,
            options: this.options,
            stock: this.stock,
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            currentImageIndex: this.currentImageIndex
        });
    }

    private createValidators(): void {
        this.id = new FormControl(-1);
        this.images = new FormArray([]);
        this.sku = new FormControl();
        this.name = new FormControl();
        this.price = new FormControl();
        this.weight = new FormControl();
        this.descriptions = new FormArray([]);
        this.thumbnail = new FormControl();
        this.category = new FormControl();
        this.options = new FormControl();
        this.stock = new FormControl(99);
        this.createdDate = new FormControl();
        this.updatedDate = new FormControl();
        this.currentImageIndex = new FormControl(0);
    }

    createDescriptionForm(): FormControl {
        return new FormControl();
    }

    createImageForm(): FormControl {
        return new FormControl();
    }

    addDescriptionControl() {
        const formDescription = this.createDescriptionForm();
        this.descriptionsForm.push(formDescription);
    }

    createDescriptionBase() {
        return {
            name: null
        }
    }

    createQuestionForm(): FormGroup {
        return this.fb.group({
            name: new FormControl(),
        });
    }

    addImageControl(image) {
        const imageProduct = this.createImageForm();
        imageProduct.patchValue(image);
        this.images.insert(0, imageProduct);
        // const existProduct = this.images.controls.findIndex((x) => x.value === image);
        // if (existProduct > -1) {
        // //   const quantity = this.images.at(existProduct).get('quantity');
        // //   quantity.setValue(quantity.value + 1);
        // } else {
        //   const imageProduct = this.creatImageForm();
        //   imageProduct.patchValue(image);
        //   this.images.insert(0, imageProduct);
        // }   
    }

    addImages(files: File[]){
        for (const file of files) {
            this.addImageControl(file);
          }
    }
}