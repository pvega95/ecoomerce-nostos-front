import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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

    constructor(
        protected fb: FormBuilder
    ) {
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

    public addVoucherDetail(item?: any): void {
        const voucher = this.createImageForm();
        if (item) {
            voucher.patchValue(item);
        }
        this.voucherDetail.insert(0, voucher);
    }

    public createImageForm(): FormControl {
        return new FormControl();
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
