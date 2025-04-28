import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MesesService {
  meses = [
    { key: 'M01', value: 'Enero', value_ca: 'Gener' },
    { key: 'M02', value: 'Febrero', value_ca: 'Febrer' },
    { key: 'M03', value: 'Marzo', value_ca: 'Març' },
    { key: 'M04', value: 'Abril', value_ca: 'Abril' },
    { key: 'M05', value: 'Mayo', value_ca: 'Maig' },
    { key: 'M06', value: 'Junio', value_ca: 'Juny' },
    { key: 'M07', value: 'Julio', value_ca: 'Juliol' },
    { key: 'M08', value: 'Agosto', value_ca: 'Agost' },
    { key: 'M09', value: 'Septiembre', value_ca: 'Setembre' },
    { key: 'M10', value: 'Octubre', value_ca: 'Octubre' },
    { key: 'M11', value: 'Noviembre', value_ca: 'Novembre' },
    { key: 'M12', value: 'Diciembre', value_ca: 'Desembre' }
  ];

  getMeses() {
    return this.meses;
  }
}