export interface IPaymentDeadline {
    _id?: string;
    description: string;
    days: number;
}

export class PaymentDeadline {
    _id?: string;
    description: string;
    days: number;
    constructor(PaymentDeadline: IPaymentDeadline){
        this._id  = PaymentDeadline._id || null;
        this.description = PaymentDeadline.description || null
        this.days = PaymentDeadline.days || null
    }
}