import {
    Component,
    Input,
    EventEmitter,
    OnInit,
    Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { forkJoin } from 'rxjs';
import { Select } from 'app/models/select';
import { Company } from '../../../../models/company';
import { Document } from '../../../../models/document';
import { PaymentDeadline } from '../../../../models/payment-deadline';
import { CompanyService } from '../../setting/company/company.service';
import { DocumentService } from '../../setting/document/document.service';
import { PaymentDeadlineService } from '../../setting/payment-deadline/payment-deadline.service';
import { SaleNote } from 'app/models/sale-note';
import { WindowModalComponent } from '../../../../shared/window-modal/window-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SaleNoteService } from '../sale-note.service';
import { ProductsService } from '../../setting/products/products.service';
import { Modal } from '../../../../enums/modal.enum';
import { Product } from 'app/models/product';
import { VoucherDetail } from 'app/models/voucher-detail';
import { SaleNotePresenter } from './create-edit-sale-note.presenter';

@Component({
    selector: 'app-create-edit-sale-note',
    templateUrl: './create-edit-sale-note.component.html',
    styleUrls: ['./create-edit-sale-note.component.scss'],
    providers: [SaleNotePresenter],
})
export class CreateEditSaleNoteComponent implements OnInit {
    @Input() salesNoteInput: SaleNote = null;
    @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() backTolist: EventEmitter<any> = new EventEmitter<any>();
    public companies: Company[];
    public documents: Document[];
    public products: Product[] = [];
    public productsFiltered: Product[] = [];
    public paymentDeadlines: PaymentDeadline[];
    public listObjDocuments: Select[];
    public listObjCompanies: Select[];
    public listObjPaymentDeadlines: Select[];
    public companyId: string = '';
    public documentId: string = '';
    public contAuxiliarCompanySelected: number = 0;
    public contAuxiliarDocumentSelected: number = 0;
    selectedSaleNoteForm: FormGroup;
    //expresion regular numeros, espacios y letras con tildes
    maskForInput: any = { mask: /^[A-Za-zÁ-ú0-9\s]+$/g };

    constructor(
        private _formBuilder: FormBuilder,
        private companyService: CompanyService,
        private fuseUtilsService: FuseUtilsService,
        private documentService: DocumentService,
        private paymentDeadlineService: PaymentDeadlineService,
        private saleNoteService: SaleNoteService,
        private productsService: ProductsService,
        public dialog: MatDialog,
        public presenter: SaleNotePresenter,
    ) {
        // this.initForm();
    }

    public get form() {
        return this.presenter.form;
    }

    public get vouchers(): FormArray {
        return this.form.get('voucherDetail') as FormArray;
      }
    
      public get voucherControls(): FormGroup[] {
        return this.vouchers.controls as FormGroup[];
    }

    ngOnInit(): void {
        this.loadValues();
    }
    getHeight(): string {
        return '23rem';
    }
    backTolistSaleNote() {
        this.backTolist.emit();
    }
    loadValues() {
        this.listObjDocuments = [];
        this.listObjCompanies = [];
        this.listObjPaymentDeadlines = [];
        this.companies = [];
        this.documents = [];
        this.paymentDeadlines = [];
        setTimeout(() => {
            this.isLoading.emit(true);
        }, 0);
        forkJoin([
            this.companyService.getListCompany(),
            this.documentService.getListDocument(),
            this.paymentDeadlineService.getListPaymentDeadline(),
            this.productsService.getListProducts(),
        ]).subscribe(
            ([
                companyResponse,
                documentResponse,
                paymentDeadlineResponse,
                productsResponse,
            ]) => {
                if (
                    companyResponse.ok &&
                    documentResponse.ok &&
                    paymentDeadlineResponse.ok &&
                    productsResponse.ok
                ) {
                    this.companies = companyResponse.data;
                    this.documents = documentResponse.data;
                    this.paymentDeadlines = paymentDeadlineResponse.data;
                    this.products = productsResponse.data;
                    this.productsFiltered = this.products;
                    //this.isLoading = false;
                    console.log(' this.products ', this.products);

                    console.log(
                        'this.salesNoteInput  value',
                        this.salesNoteInput
                    );
                    // this.selectedSaleNoteForm.patchValue({
                    //     id: this.salesNoteInput?._id || '-1',
                    //     client: this.salesNoteInput?.client.comercialName || '',
                    //     company: this.salesNoteInput?.company || '',
                    //     document: this.salesNoteInput?.document._id || '',
                    //     serie: this.salesNoteInput?.serie || '',
                    //     documentNumber:
                    //         this.salesNoteInput?.documentNumber || '',
                    //     paymentdeadline:
                    //         this.salesNoteInput?.paymentDeadline._id || '',
                    //     status: this.salesNoteInput?.status || '',
                    //     reference: this.salesNoteInput?.reference || '',
                    //     note: this.salesNoteInput?.note || '',
                    //     registryDate: this.salesNoteInput
                    //         ? this.fuseUtilsService.formatDateOut(
                    //               this.salesNoteInput.registryDate
                    //           )
                    //         : '',
                    //     updatedAt: this.salesNoteInput
                    //         ? this.fuseUtilsService.formatDateOut(
                    //               this.salesNoteInput.updatedAt
                    //           )
                    //         : '',
                    // });

                    this.listObjDocuments =
                        FuseUtilsService.formatOptionsDocument(this.documents);
                    this.listObjCompanies =
                        FuseUtilsService.formatOptionsCompany(this.companies);
                    this.listObjPaymentDeadlines =
                        FuseUtilsService.formatOptionsPaymentDeadline(
                            this.paymentDeadlines
                        );
                    console.log(
                        'documento ',
                        // this.selectedSaleNoteForm.get('document').value,
                        this.listObjDocuments
                    );
                    this.isLoading.emit(false);
                }
            }
        );
    }
    objCompanySelected(objCompany: Select) {
        if (this.contAuxiliarCompanySelected > 0) {
            // para editar
            this.documentId = this.selectedSaleNoteForm.controls.document.value;
            this.companyId = objCompany.id as string;
            this.asignSerie();
        } else {
            this.contAuxiliarCompanySelected++;
        }
        if (!this.salesNoteInput) {
            // para crear
            this.contAuxiliarCompanySelected = 0;
            // this.documentId = this.selectedSaleNoteForm.controls.document.value;
            this.companyId = objCompany.id as string;
            this.asignSerie();
        }
    }
    objDocumentSelected(objDocument: Select) {
        console.log('objDocument', objDocument);
        if (this.contAuxiliarDocumentSelected > 0) {
            // para editar
            this.companyId = this.selectedSaleNoteForm.controls.company.value;
            this.documentId = objDocument.id as string;
            this.asignSerie();
        } else {
            this.contAuxiliarDocumentSelected++;
        }
        if (!this.salesNoteInput) {
            // para crear
            this.contAuxiliarDocumentSelected = 0;
            //  this.companyId =  this.selectedSaleNoteForm.controls.company.value;
            this.documentId = objDocument.id as string;
            this.asignSerie();
        }
    }
    asignSerie() {
        if (this.companyId !== '' && this.documentId !== '') {
            this.isLoading.emit(true);
            this.saleNoteService
                .getSerie(this.companyId, this.documentId)
                .subscribe((resp) => {
                    if (resp.success) {
                        this.selectedSaleNoteForm.patchValue({
                            serie: resp.data[0].series,
                            documentNumber: resp.data[0].currentCorrelative,
                        });
                        this.isLoading.emit(false);
                    }
                });
        }
    }
    objPaymentDeadlineSelected(objDocument: Select) {}

    initForm() {
        this.selectedSaleNoteForm = this._formBuilder.group({
            id: [''],
            client: ['', [Validators.required]],
            company: ['', [Validators.required]],
            document: ['', [Validators.required]],
            serie: [
                '',
                [
                    Validators.required,
                    Validators.minLength(1),
                    FuseUtilsService.sinEspaciosEnBlanco,
                ],
            ],
            documentNumber: ['', [Validators.required]],
            paymentdeadline: ['', [Validators.required]],
            status: ['', [Validators.required]],
            reference: ['', [Validators.required]],
            note: ['', [Validators.required]],
            registryDate: ['', [Validators.required]],
            updatedAt: ['', [Validators.required]],
        });
        this.selectedSaleNoteForm.controls.serie.disable();
        this.selectedSaleNoteForm.controls.documentNumber.disable();
        this.selectedSaleNoteForm.controls.registryDate.disable();
        this.selectedSaleNoteForm.controls.updatedAt.disable();
    }
    addItem(): void {
        const dialogRef = this.dialog.open(WindowModalComponent, {
            width: '48rem',
            height: '30rem',
            data: {
                type: Modal.newItem,
                voucherDetail: this.salesNoteInput ? this.salesNoteInput.voucherDetail : []
            },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((products: Product[]) => {
            // let voucherDetailAdded: VoucherDetail[] = [];
            if (products) {
                console.log('products', products);
                this.presenter.addVoucherDetails(products);
                // productsAdded.forEach((productAdded) => {
                //     this.salesNoteInput?.voucherDetail.push({
                //         id: productAdded.discount,
                //         sku: productAdded.sku,
                //         name: productAdded.name,
                //         quantity: 1,
                //         igv: environment.IGV * 100,
                //         unitaryAmountNC: 0,
                //         brutoAmountNC: productAdded.grossPrice,
                //         igvAmountNC: productAdded.igvPrice,
                //         totalAmountNC: productAdded.netoprice,
                //     });
                //     this.salesNoteInput.brutoTotalNC =
                //         this.salesNoteInput.brutoTotalNC +
                //         productAdded.grossPrice;
                //     this.salesNoteInput.igvTotalNC =
                //         this.salesNoteInput.igvTotalNC + productAdded.igvPrice;
                //     this.salesNoteInput.salesTotalNC =
                //         this.salesNoteInput.salesTotalNC +
                //         productAdded.netoprice;
                // });
                // this.salesNoteInput?.voucherDetail.push(voucherDetailAdded)
            }
        });
    }
    deleteItem(sku: string): void {
        //  console.log('voucherId', sku)
        let voucherDetailFound: VoucherDetail[];
        if (this.salesNoteInput) {
            voucherDetailFound = this.salesNoteInput?.voucherDetail.filter(
                (voucher) => voucher.sku === sku
            );
            this.salesNoteInput.voucherDetail =
                this.salesNoteInput?.voucherDetail.filter(
                    (voucher) => voucher.sku !== sku
                );
            this.salesNoteInput.brutoTotalNC =
                this.salesNoteInput.brutoTotalNC -
                voucherDetailFound[0].brutoAmountNC;
            this.salesNoteInput.igvTotalNC =
                this.salesNoteInput.igvTotalNC -
                voucherDetailFound[0].igvAmountNC;
            this.salesNoteInput.salesTotalNC =
                this.salesNoteInput.salesTotalNC -
                voucherDetailFound[0].totalAmountNC;
        }
    }
    cancelSelectedSaleNote(): void {}
    createSaleNote(): void {}
    saveSelectedSaleNote(): void {}
}
