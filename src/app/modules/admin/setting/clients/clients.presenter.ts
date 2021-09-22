import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { Select } from "app/models/select";
import { ClientsService } from './clients.service';



@Injectable()
export class ClientPresenter {
    form: FormGroup;
    uid: FormControl;
    name: FormControl;
    lastName: FormControl;
    billing_address: FormArray;
    email: FormControl;
    phone: FormControl;
    createdAt: FormControl;
    updatedAt: FormControl;
public provinces: any[];
public listObjProvince: Select[];

    constructor(
        protected fb: FormBuilder, 
        private fuseUtilsService: FuseUtilsService,
        private clientsService: ClientsService) {
        console.log('Client Presenter');
        this.createValidators();
        this.createForm();
        this.loadUbigeo();
    }
    async loadUbigeo(): Promise<void>{
      let resp1;
      let resp2;
      let resp3;
      this.provinces = [];
      this.listObjProvince = [];

      resp1 = await this.clientsService.listarDepartamentos();
      resp2 = await this.clientsService.listarProvincias('07');
      resp3 = await this.clientsService.listarDistritos('0701');
    if (resp1.ok) {
        console.log('depart', resp1)
        this.provinces = resp1.data;
        this.provinces.forEach(province => {
            this.listObjProvince.push({
                id: province.id as string,
                label: province.name
            });
        });
    }
    console.log('provicia', resp2)
    console.log('distrito', resp3)


    }
    private createValidators(): void {
        this.uid = new FormControl(-1);
        this.name = new FormControl();
        this.lastName = new FormControl();
        this.billing_address = new FormArray([]);
        this.email = new FormControl();
        this.phone = new FormControl();
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
    createAddressForm(val?: string): FormControl {
        return new FormControl(val || '');
    }
    addAddressControl(val?: string) {
        const formAddress = this.createAddressForm(val);
        this.billingAddressForm.push(formAddress);
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

    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
          formArray.removeAt(0)
        }
      }
    objProvinceSelected(event, index: number){

      }
    formatoFecha(fecha: string): string{
    return this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha))
    }

}