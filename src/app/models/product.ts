export interface IProduct {
    _id: string;
    sku: string;
    name: string;
    listprice: number;
    weight: number;
    descriptions: string[];
    thumbnail: string;
    images: File[];
    category: string;
    brand: string;
    unid: string;
    stock: number;
    hasIGV: boolean;
    grossPrice: number;
    igvPrice: number;
    netoprice: number;
    createdAt: string;
    updatedAt: string;
}

export class Product {
    _id: string;
    sku: string;
    name: string;
    listprice: number;
    weight: number;
    descriptions: string[];
    thumbnail: string;
    images: File[];
    category: string;
    brand: string;
    unid: string;
    stock: number;
    hasIGV: boolean;
    grossPrice: number;
    igvPrice: number;
    netoprice: number;
    createdAt: string;
    updatedAt: string;
    constructor(product: IProduct){
        this._id  = product._id || null;
        this.sku  = product.sku || null;
        this.name = product.name || null;
        this.listprice = product.listprice || null;
        this.weight = product.weight || null;
        this.descriptions = product.descriptions || [];
        this.thumbnail = product.thumbnail || null;
        this.images = product.images || [];
        this.category = product.category || null;
        this.brand = product.brand || null;
        this.unid = product.unid || null;
        this.stock = product.stock || 99;
        this.hasIGV = product.hasIGV || null;
        this.grossPrice = product.grossPrice || null;
        this.igvPrice = product.igvPrice || null;
        this.netoprice = product.netoprice || null;
        this.createdAt = product.createdAt || null;
        this.updatedAt = product.updatedAt || null;
    }
}