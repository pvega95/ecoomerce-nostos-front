export interface ISelect {
    id: string | number;
    label: string;
}

export class Select {
    id: string | number;
    label: string;
    constructor(select: ISelect){
        this.id  = select.id || null;
        this.label = select.label || null;
    }
}