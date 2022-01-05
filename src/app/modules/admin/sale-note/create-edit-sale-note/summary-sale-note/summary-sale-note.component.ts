import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-summary-sale-note',
    templateUrl: './summary-sale-note.component.html',
    // styles: [``],
})
export class SummarySaleNoteComponent implements OnInit {
    @Input() form: FormGroup;
    totalGrossNC: 0;
    totalDiscountNC: 0;
    totalOperationGravNC: 0;
    totalOperationExonNC: 0;
    totalIGV: 0;
    subscriptionProducts: Subscription;
    ngOnInit(): void {
        this.calculationTotals(this.products.getRawValue());
        this.subscriptionProducts = this.products.valueChanges.subscribe(
            (products) => {
                this.calculationTotals(products);
            }
        );
    }

    public get products(): FormArray {
        return this.form.get('voucherDetail') as FormArray;
    }

    calculationTotals(products: any[]): void {
        console.log(products);
        this.totalGrossNC = products.reduce((a, b) => a + b.unitaryAmountNC * b.quantity , 0);
        this.totalDiscountNC = products.reduce((a, b) => a + (b.unitaryAmountNC * b.quantity) * ( b.discount / 100 ) , 0);
    }
}
