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
    discountTotalNC: FormControl;
    gravTotalNC: FormControl;
    exonTotalNC: FormControl;
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
            discountTotalNC: this.discountTotalNC,
            gravTotalNC: this.gravTotalNC,
            exonTotalNC: this.exonTotalNC,
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
            const quantity = product.quantity;
            const brutoAmountNC = quantity * product.unitaryAmountNC;
            const discountAmountNC = brutoAmountNC * (product.discount / 100);
            const salesAmountNC = brutoAmountNC - discountAmountNC;
            const igvAmountNC = salesAmountNC * 0.18;
            this.voucherDetail.at(existProduct).patchValue(
                {
                    quantity,
                    brutoAmountNC,
                    discountAmountNC,
                    salesAmountNC,
                    igvAmountNC,
                },
                {
                    emitEvent: false,
                }
            );
            this.updateSaleNoteTotals();
        } else {
            const formProduct = this.createVoucherDetailForm();
            const quantity = 1;
            const unitaryAmountNC = product.grossPrice;
            const brutoAmountNC = unitaryAmountNC * quantity;
            const discountAmountNC = brutoAmountNC * (product.discount / 100);
            const salesAmountNC = brutoAmountNC - discountAmountNC;
            const igvAmountNC = salesAmountNC * 0.18;
            formProduct.patchValue({
                ...product,
                quantity,
                unitaryAmountNC,
                brutoAmountNC,
                discountAmountNC,
                salesAmountNC,
                igvAmountNC,
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

    public updateSaleNoteTotals(): void {
        const voucherDetail = this.form.get('voucherDetail').value;
        const brutoTotalNC = voucherDetail.reduce(
            (a, b) => a + b.unitaryAmountNC * b.quantity,
            0
        );
        const discountTotalNC = voucherDetail.reduce(
            (a, b) => a + b.unitaryAmountNC * b.quantity * (b.discount / 100),
            0
        );
        const gravTotalNC = voucherDetail.reduce(
            (a, b) => a + b.brutoAmountNC - b.discountAmountNC,
            0
        );
        const exonTotalNC = 0;
        const igvTotalNC = voucherDetail.reduce((a, b) => a + b.igvAmountNC, 0);
        const salesTotalNC = gravTotalNC + exonTotalNC + igvTotalNC;
        this.form.patchValue(
            {
                brutoTotalNC,
                discountTotalNC,
                gravTotalNC,
                exonTotalNC,
                igvTotalNC,
                salesTotalNC
            },
            {
                onlySelf: true,
                emitEvent: false,
            }
        );
        console.log(this.form.value);
    }

    public updateSeriesForm(serie: string, correlative: string): void {
        this.form.patchValue({
            serie: serie,
            documentNumber: correlative,
        });
    }

    private createValidators(): void {
        this._id = new FormControl('');
        this.client = new FormControl('');
        this.company = new FormControl('');
        this.document = new FormControl('');
        this.serie = new FormControl({value: '', disabled: true});
        this.documentNumber = new FormControl({value: '', disabled: true});
        this.registryDate = new FormControl('');
        this.paymentDeadline = new FormControl('');
        this.paymentMethod = new FormControl('');
        this.status = new FormControl('');
        this.reference = new FormControl('');
        this.note = new FormControl('');
        this.dispatchStatus = new FormControl('');
        this.voucherDetail = new FormArray([]);
        this.brutoTotalNC = new FormControl(0);
        this.discountTotalNC = new FormControl(0);
        this.gravTotalNC = new FormControl(0);
        this.exonTotalNC = new FormControl(0);
        this.igvTotalNC = new FormControl(0);
        this.salesTotalNC = new FormControl(0);
        this.createdAt = new FormControl('');
        this.updatedAt = new FormControl('');
    }
}
