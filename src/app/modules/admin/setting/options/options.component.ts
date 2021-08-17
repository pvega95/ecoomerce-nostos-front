import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { OptionsService } from './options.service';

import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styles: [
          `
          .inventory-grid {
              grid-template-columns: 48px auto 40px;

              @screen sm {
                  grid-template-columns: 48px auto 112px 72px;
              }

              @screen md {
                  grid-template-columns: 14rem 10rem 10rem 13rem 8rem;
              }

              @screen lg {
                  grid-template-columns: 14rem 10rem 10rem 13rem 8rem;
              }
          }
      `
  ],
  animations     : fuseAnimations
})
export class OptionsComponent implements OnInit {
  options: any[] = [];
  isLoading: boolean = true;
  searchInputControl: FormControl = new FormControl();
  selectedOption: any = null;
  selectedOptionForm: FormGroup;

  constructor(
    private fuseUtilsService: FuseUtilsService,
    private optionsService: OptionsService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.cargarListaOpciones();
  }
  async cargarListaOpciones(){
    let resp: any;
    resp = await this.optionsService.listarOpciones();
    if(resp.ok){
      // Get the opciones
      this.options = resp.data;
      this.isLoading = false;
      console.log('lista opciones',resp.data);
    }

  }

  agregarNuevaOpcion(){
    
  }
}
