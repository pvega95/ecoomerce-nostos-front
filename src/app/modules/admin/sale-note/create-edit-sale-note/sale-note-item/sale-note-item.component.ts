import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sale-note-item',
    templateUrl: './sale-note-item.component.html',
    styles: [
        `
            .inventory-grid-create-edit {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: repeat(6, 1fr);
                }

                @screen lg {
                    grid-template-columns: repeat(6, 1fr);
                }
            }
        `,
    ],
})
export class SaleNoteItemComponent implements OnInit {
    @Input() index: number;
    @Input() vouchersLength: number;
    @Input() voucher: FormGroup;
    sku = '';
    name = '';
    total = 0;
    quantity = 0;
    netoprice = 0;
    subscription: Subscription;

    ngOnInit(): void {
        this.setInitialData();
        this.subscription = this.voucher.valueChanges.subscribe((voucher) => {
            console.log(voucher);
            this.calculationTotals(voucher);
        });
    }

    calculationTotals(voucher): void {
        this.total = voucher.quantity * voucher.totalAmountNC;
    }

    deleteItem(index: number): void {}

    private setInitialData(): void {
        this.sku = this.voucher.get('sku').value;
        this.name = this.voucher.get('name').value;
        this.quantity = this.voucher.get('quantity').value;
        this.netoprice = this.voucher.get('totalAmountNC').value;
      }

      ngOnChanges(changes: SimpleChanges): void {
        console.log(this.voucher.getRawValue());
        if (changes.voucher && changes.voucher.currentValue !== changes.voucher.previousValue) {
            this.calculationTotals(this.voucher.getRawValue());
        }
      }
    
      ngOnDestroy(): void {
        this.subscription.unsubscribe();
      }
}
