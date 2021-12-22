export interface IProduct {
    sku: string;
    name: string;
    category: string;
    brand: string;
    unid:string;
    discount: number;
    listprice: number;
    descriptions: string[];
    images: File[];
    stock: number;
    hasIGV: boolean;
}

export class Product {
    sku: string;
    name: string;
    category: string;
    brand: string;
    unid:string;
    discount: number;
    listprice: number;
    descriptions: string[];
    images: File[];
    stock: number;
    hasIGV: boolean;
    constructor(product: IProduct){
        this.sku  = product.sku || null;
        this.name = product.name || null;
        this.category = product.category || null;
        this.brand = product.brand || null;
        this.unid = product.unid || null;
        this.discount = product.discount || 0;
        this.listprice = product.listprice || null;
        this.descriptions = product.descriptions || [];
        this.images = product.images || [];
        this.stock = product.stock || 99;
        this.hasIGV = product.hasIGV || true;
    }
}