export interface IVoucherDetail {
    id: string | number;
    sku: string;
    name: string;
    quantity: number;
    igv: number;
    unitaryAmountNC: number;
    brutoAmountNC: number;
    igvAmountNC: number;
    totalAmountNC: number;
}

export class VoucherDetail {
    id: string | number;
    sku: string;
    name: string;
    quantity: number;
    igv: number;
    unitaryAmountNC: number;
    brutoAmountNC: number;
    igvAmountNC: number;
    totalAmountNC: number;
    constructor(voucherDetail: IVoucherDetail){
        this.id  = voucherDetail.id || null;
        this.sku = voucherDetail.sku || null;
        this.name = voucherDetail.name || null;
        this.quantity = voucherDetail.quantity || null;
        this.igv = voucherDetail.igv || null;
        this.unitaryAmountNC = voucherDetail.unitaryAmountNC || null;
        this.brutoAmountNC = voucherDetail.brutoAmountNC || null;
        this.igvAmountNC = voucherDetail.igvAmountNC || null;
        this.totalAmountNC = voucherDetail.totalAmountNC || null;

    }
}