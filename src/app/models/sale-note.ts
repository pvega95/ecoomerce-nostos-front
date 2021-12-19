import { Client } from "./client";
import { PaymentDeadline } from "./payment-deadline";
import { VoucherDetail } from "./voucher-detail";

export interface ISaleNote {
    _id?: string;
    client: Client;
    document: any;
    serie: string;
    documentNumber: number;
    registryDate: string;
    paymentDeadline: PaymentDeadline;
    paymentMethod: string;
    status: string;
    reference: string;
    note: string;
    dispatchStatus: string;
    voucherDetail: VoucherDetail;
    brutoTotalNC: number;
    igvTotalNC: number;
    salesTotalNC: number;
    createdAt: string;
    updatedAt: string;
}

export class SaleNote {
    _id?: string;
    client: Client;
    document: any;
    serie: string;
    documentNumber: number;
    registryDate: string;
    paymentDeadline: PaymentDeadline;
    paymentMethod: string;
    status: string;
    reference: string;
    note: string;
    dispatchStatus: string;
    voucherDetail: VoucherDetail;
    brutoTotalNC: number;
    igvTotalNC: number;
    salesTotalNC: number;
    createdAt: string;
    updatedAt: string;
    constructor(saleNote: ISaleNote){
        this._id  = saleNote._id || null;
        this.client = saleNote.client || null;
        this.document = saleNote.document || null;
        this.serie = saleNote.serie || null;
        this.documentNumber = saleNote.documentNumber || null;
        this.registryDate = saleNote.registryDate || null;
        this.paymentDeadline = saleNote.paymentDeadline || null;
        this.paymentMethod = saleNote.paymentMethod || null;
        this.status = saleNote.status || null;
        this.reference = saleNote.reference || null;
        this.note = saleNote.note || null;
        this.dispatchStatus = saleNote.dispatchStatus || null;
        this.voucherDetail = saleNote.voucherDetail || null;
        this.brutoTotalNC = saleNote.brutoTotalNC || null;
        this.igvTotalNC = saleNote.igvTotalNC || null;
        this.salesTotalNC = saleNote.salesTotalNC || null;
        this.createdAt = saleNote.createdAt || null;
        this.updatedAt = saleNote.updatedAt || null;
    }
}