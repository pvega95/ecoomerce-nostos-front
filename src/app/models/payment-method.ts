export interface IPaymentMethod {
    _id?: string;
    description: string;
    status?: boolean;
    createdAt: string;
    updatedAt: string;
}

export class PaymentMethod {
    _id?: string;
    description: string;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
    constructor(PaymentMethod: IPaymentMethod){
        this._id  = PaymentMethod._id || null;
        this.description = PaymentMethod.description || null;
        this.createdAt = PaymentMethod.createdAt || null;
        this.updatedAt = PaymentMethod.updatedAt || null;
    }
}