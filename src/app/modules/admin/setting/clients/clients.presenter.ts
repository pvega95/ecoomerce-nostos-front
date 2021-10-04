import { AfterViewInit, ChangeDetectorRef, Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { AddressClient } from "app/models/address-client";
import { Select } from "app/models/select";
import { ClientsService } from './clients.service';



@Injectable()
export class ClientPresenter  {
    form: FormGroup;
    uid: FormControl;
    name: FormControl;
    lastName: FormControl;
    billing_address: FormArray;
    email: FormControl;
    phone: FormControl;
    createdAt: FormControl;
    updatedAt: FormControl;

    public addressClient: AddressClient[];
    public departments: any[];
    public provinces: any[];
    public districts: any[];
    public listObjDepartment: Select[];
    public listObjProvince: Select[];
    public listObjDistrict: Select[];
    public disableButtonRemoveBillingAddress: boolean;
    public maskForTelephone: any =
    { mask: Number,
      radix: '.',
      signed: false,
      mapToRadix: [','],
      scale: 0,
      min: 9999 ,
      max: 999999999 };

    constructor(
        protected fb: FormBuilder, 
        protected formBuilder: FormBuilder,
        private fuseUtilsService: FuseUtilsService,
        private clientsService: ClientsService,) {
        this.createValidators();
        this.createForm();
        this.loadUbigeo();
    }

    async loadUbigeo(): Promise<void>{
      let resp1;
      let resp2;
      let resp3;
      this.departments = [];
 
      this.listObjDepartment = [];
      this.listObjProvince = [];
      this.listObjDistrict = [];
      this.addressClient = [];

      resp1 = await this.clientsService.listarDepartamentos();
    if (resp1.ok) {
        this.departments = resp1.data;
        this.listObjDepartment = this.formatOptions(this.departments);
    }



    }
    private createValidators(): void {
        this.uid = new FormControl(-1);
        this.name = new FormControl('', [ Validators.required, ]);
        this.lastName = new FormControl('', [ Validators.required, ]);
        this.billing_address = new FormArray([]);
        this.email = new FormControl('', [ Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')],);
        this.phone = new FormControl('', [ Validators.required, Validators.minLength(9),  Validators.maxLength(9), Validators.pattern('[0-9]{9,9}') ],);
        this.createdAt = new FormControl();
        this.updatedAt = new FormControl();
    }

    createForm(): void {
        this.form = this.fb.group({
            uid: this.uid,
            name: this.name,
            lastName: this.lastName,
            billing_address: this.billing_address,
            email: this.email,
            phone: this.phone,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        });
    }

    loadClientForm(client){
        this.resetClientForm();
      //  this.loadAddressClient(client);
        this.provinces = [];
        this.districts = [];
    
        const { billing_address } = client;

        this.form.patchValue({
            uid: client.uid,
            name: client.full_name.name,
            lastName: client.full_name.lastName,
            email: client.email,
            phone: client.phone,
            createdAt: this.formatoFecha(client.createdAt),
            updatedAt: this.formatoFecha(client.updatedAt)
        });
        if(billing_address.length > 0) {
            billing_address.map(b_address => this.addAddressControl(b_address));
        } 
        
    }
    createAddressForm(val?: AddressClient): FormGroup{
        return  this.formBuilder.group({
            department: new FormControl(val?.department || ''),
            province: new FormControl(val?.province || ''),
            district: new FormControl(val?.district || ''),
            address:  new FormControl(val?.address || '' , [ Validators.required,]),
            reference: new FormControl(val?.reference || '' , [ Validators.required,]),
            listObjProvince: new FormControl([]),
            listObjDistrict: new FormControl([]),
        });
        
        //new FormControl(val || '');
    }
    addAddressControl(val?: AddressClient) {
        const formAddress = this.createAddressForm(val);
        this.billingAddressForm.push(formAddress);
        this.verifyLongArrayBillingAddressForm();
    }
    removeAddressControl(){
        this.billingAddressForm.removeAt(this.billingAddressForm.length - 1);
        this.verifyLongArrayBillingAddressForm();
    }
    verifyLongArrayBillingAddressForm(): void{
        if (this.billingAddressForm.length === 0) {
            this.disableButtonRemoveBillingAddress = true;
        } else {
            this.disableButtonRemoveBillingAddress = false;
        }

    }

    get billingAddressForm() {
        return this.form.get('billing_address') as FormArray;
    }

    get billingAddressesControls() {
        return this.billingAddressForm.controls as FormGroup[];
    }

    resetClientForm(){
        this.form.reset();
        this.clearFormArray(this.billing_address);
    }
    addAddress(){
     this.addAddressControl();
    }
    removeAddress(){
     this.removeAddressControl();
    }

    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
          formArray.removeAt(0)
        }
      }
    objDistrictSelected(event, index: number){
        this.billingAddressesControls[index].patchValue({
            district: event.id
        });
    }
async objProvinceSelected(event, index: number){
        let resp: any;
        this.billingAddressesControls[index].patchValue({
            listObjDistrict: []
            });
        resp = await this.clientsService.listarDistritos(event.id);   
        if (resp.ok) {
            const districts = resp.data;
            const listObjDistrict = this.formatOptions(districts);
            this.billingAddressesControls[index].patchValue({
                listObjDistrict: listObjDistrict
            });

            this.billingAddressesControls[index].patchValue({
                province: event.id
            });
        }

      }
 objDepartmentSelected(event, index: number){
       let resp: any;
       this.listObjProvince = [];
       this.billingAddressesControls[index].patchValue({
        listObjProvince: [],
        listObjDistrict: []
        });
        this.clientsService.listarProvincias(event.id).then((resp)=>{
            if (resp.ok) {
                const provinces = resp.data;
                const listObjProvince = this.formatOptions(provinces);
                this.listObjProvince = listObjProvince;
                this.billingAddressesControls[index].patchValue({
                    listObjProvince: listObjProvince,
                    department: event.id
                });
             /*    if (this.form.get('uid')?.value === null) {
                
                } */
        
            }
        });   
    }

    formatOptions(listObjRaw: any[]): Select[]{
        let listObj: Select[] = [];
        listObjRaw.forEach(objRaw => {
            listObj.push({
                id: objRaw.id as string,
                label: objRaw.name
            })
        });
    return listObj;
    }
    createNewClient(){
       
        if (this.form.valid) {
            const body = 
            { 
                email: this.form.get('email').value,
                full_name: {
                    name: this.form.get('name').value,
                    lastName: this.form.get('lastName').value
                },
                billing_address: [
                    {
                        "address": "Jr.loreto 107",
                        "department": "07",
                        "province": "0701",
                        "district": "070103",
                        "reference": "cerca al hospital"
                    }
                ],
                phone: this.form.get('phone').value,
                google: false
            }
            console.log('body value', body)
            
            
        } else {
            
        }

    }

    formatoFecha(fecha: string): string{
    return this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha))
    }

}