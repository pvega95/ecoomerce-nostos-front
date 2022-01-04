import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-summary-sale-note',
    templateUrl: './summary-sale-note.component.html',
    styles: [``],
})
export class SummarySaleNoteComponent implements OnInit {
    @Input() form: FormGroup;
    subtotal = 0;
    igv = 0;
    total = 0;
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

    calculationTotals(products): void {
        this.subtotal = products.reduce(
            (a, b) => a + b.quantity * b.totalAmountNC,
            0
        );
        this.igv = 0;
        this.total = this.subtotal + this.igv;
    }
}
