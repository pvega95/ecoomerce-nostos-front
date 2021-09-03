export interface IProduct {
    sku: string;
    name: string;
    price: number;
    weight: number;
    descriptions: string[];
    thumbnail: string;
    images: File[];
    category: string;
    stock: number;
}

export class Product {
    sku: string;
    name: string;
    price: number;
    weight: number;
    descriptions: string[];
    thumbnail: string;
    images: File[];
    category: string;
    stock: number;
    constructor(product: IProduct){
        this.sku  = product.sku || null;
        this.name = product.name || null;
        this.price = product.price || null;
        this.weight = product.weight || null;
        this.descriptions = product.descriptions || [];
        this.thumbnail = product.thumbnail || null;
        this.images = product.images || [];
        this.category = product.category || null;
        this.stock = product.stock || 99;
    }
}