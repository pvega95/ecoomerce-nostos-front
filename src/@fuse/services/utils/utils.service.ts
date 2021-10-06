import { Injectable } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class FuseUtilsService
{

    private idClient$: BehaviorSubject<any> = new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    getIdClient(): Observable<any> {
        return this.idClient$.asObservable();
      }
    
    setIdClient(id: string) {
          this.idClient$.next(id);
      }

    /**
     * Get the equivalent "IsActiveMatchOptions" options for "exact = true".
     */
    get exactMatchOptions(): IsActiveMatchOptions
    {
        return {
            paths       : 'exact',
            fragment    : 'ignored',
            matrixParams: 'ignored',
            queryParams : 'exact'
        };
    }

    /**
     * Get the equivalent "IsActiveMatchOptions" options for "exact = false".
     */
    get subsetMatchOptions(): IsActiveMatchOptions
    {
        return {
            paths       : 'subset',
            fragment    : 'ignored',
            matrixParams: 'ignored',
            queryParams : 'subset'
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Generates a random id
     *
     * @param length
     */
    randomId(length: number = 10): string
    {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let name = '';

        for ( let i = 0; i < 10; i++ )
        {
            name += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return name;
    }

    stringToDate(fechaInString: string): Date{
        let fecha = fechaInString.split('T')[0].split('-');
        let anio = Number(fecha[0]);
        let mes = Number(fecha[1]) - 1;
        let dia = Number(fecha[2]);
    
        return new Date(anio, mes, dia);
      }
    formatDate(date: Date): string {
        let day
        let month
        let year
        const d = new Date(date);
        day = '' + d.getDate();
        month = '' + (d.getMonth() + 1);
        year = d.getFullYear();
        if (month.length < 2) {
        month = '0' + month;
        }
        if (day.length < 2) {
        day = '0' + day;
        }
        //return [year, month, day].join('-');
        return [day, month, year].join('/');
      }

      static sinEspaciosEnBlanco(control: AbstractControl) : ValidationErrors | null {
        if(control.value != null){
            if((control.value as string).trim().length > 0){
                return null;
            }
      
            return {sinEspaciosEnBlanco: true};
        }else{
            return null;
        }

    }

    async readImageFile(file: File): Promise<string | ArrayBuffer> {
		return new Promise<string | ArrayBuffer>((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = e => {
				resolve((e.target as FileReader).result);
			};

			reader.onerror = e => {
				console.error(`FileReader failed on file ${file.name}.`);
				reject(e);
			};

			if (!file) {
				return reject('No file to read. Please provide a file using the [file] Input property.');
			}

			reader.readAsDataURL(file);
		});
	}


}
