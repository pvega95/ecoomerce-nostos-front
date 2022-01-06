import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Product } from 'app/models/product';

@Injectable()
export class SaleNotePresenter {
    form: FormGroup;
    _id: FormControl;
    client: FormControl;
    company: FormControl;
    document: FormControl;
    serie: FormControl;
    documentNumber: FormControl;
    registryDate: FormControl;
    paymentDeadline: FormControl;
    paymentMethod: FormControl;
    status: FormControl;
    reference: FormControl;
    note: FormControl;
    dispatchStatus: FormControl;
    voucherDetail: FormArray;
    brutoTotalNC: FormControl;
    igvTotalNC: FormControl;
    salesTotalNC: FormControl;
    createdAt: FormControl;
    updatedAt: FormControl;

    constructor(protected fb: FormBuilder) {
        this.createValidators();
        this.createForm();
    }

    createForm(): void {
        this.form = this.fb.group({
            _id: this._id,
            client: this.client,
            company: this.company,
            document: this.document,
            serie: this.serie,
            documentNumber: this.documentNumber,
            registryDate: this.registryDate,
            paymentDeadline: this.paymentDeadline,
            paymentMethod: this.paymentMethod,
            status: this.status,
            reference: this.reference,
            note: this.note,
            dispatchStatus: this.dispatchStatus,
            voucherDetail: this.voucherDetail,
            brutoTotalNC: this.brutoTotalNC,
            igvTotalNC: this.igvTotalNC,
            salesTotalNC: this.salesTotalNC,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
    }

    public addVoucherDetail(product?: any): void {
        const existProduct = this.voucherDetail.controls.findIndex(
            (x: FormControl) => x.value.sku === product.sku
        );
        if (existProduct > -1) {
            // const quantity = this.voucherDetail
            //     .at(existProduct)
            //     .get('quantity');
            // quantity.setValue(quantity.value + 1);
            console.log('product', product);
            const quantity = product.quantity;
            const brutoAmountNC = quantity * product.unitaryAmountNC;
            const discountAmountNC = brutoAmountNC * ( product.discount / 100 );
            const salesAmountNC = brutoAmountNC - discountAmountNC;
            const igvAmountNC = salesAmountNC * 0.18;
            console.table({
                quantity,
                brutoAmountNC,
                discountAmountNC,
                salesAmountNC,
                igvAmountNC
            });
            this.voucherDetail.at(existProduct).patchValue({
                quantity,
                brutoAmountNC,
                discountAmountNC,
                salesAmountNC,
                igvAmountNC
            }, {
                onlySelf: true,
                emitEvent: false
              });

        } else {
            const formProduct = this.createVoucherDetailForm();
            const quantity = 1;
            const unitaryAmountNC = product.grossPrice;
            const brutoAmountNC = unitaryAmountNC * quantity;
            const discountAmountNC = brutoAmountNC * ( product.discount / 100 );
            const salesAmountNC = brutoAmountNC - discountAmountNC;
            const igvAmountNC = salesAmountNC * 0.18;
            formProduct.patchValue({
                ...product,
                quantity,
                unitaryAmountNC,
                brutoAmountNC,
                discountAmountNC,
                salesAmountNC,
                igvAmountNC
            });
            this.voucherDetail.push(formProduct);
        }
    }

    public createVoucherDetailForm(): FormGroup {
        return this.fb.group({
            _id: new FormControl(),
            sku: new FormControl(),
            name: new FormControl(),
            quantity: new FormControl(),
            igv: new FormControl(),
            discount: new FormControl(),
            //VALOR UNITARIO X ITEM
            unitaryAmountNC: new FormControl(),
            //VALOR VENTA BRUTO
            brutoAmountNC: new FormControl(),
            //DESCUENTO X ITEM
            discountAmountNC: new FormControl(),
            //VALOR VENTA X ITEM
            salesAmountNC: new FormControl(),
            //IGV
            igvAmountNC: new FormControl(),
            // totalAmountNC: new FormControl(),
        });
    }

    public addVoucherDetails(products: any): void {
        products.forEach((product) => {
            this.addVoucherDetail(product);
        });
        this.voucherDetail.markAsPristine();
    }

    private createValidators(): void {
        this._id = new FormControl('');
        this.client = new FormControl('');
        this.company = new FormControl('');
        this.document = new FormControl('');
        this.serie = new FormControl('');
        this.documentNumber = new FormControl('');
        this.registryDate = new FormControl('');
        this.paymentDeadline = new FormControl('');
        this.paymentMethod = new FormControl('');
        this.status = new FormControl('');
        this.reference = new FormControl('');
        this.note = new FormControl('');
        this.dispatchStatus = new FormControl('');
        this.voucherDetail = new FormArray([]);
        this.brutoTotalNC = new FormControl('');
        this.igvTotalNC = new FormControl('');
        this.salesTotalNC = new FormControl('');
        this.createdAt = new FormControl('');
        this.updatedAt = new FormControl('');
    }
}
