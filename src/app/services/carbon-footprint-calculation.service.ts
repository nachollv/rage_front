import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarbonFootprintCalculationService {
  private apiUrl = 'https://rage.industrialocalsostenible.com/public/index.php'
  
  constructor() { }
}
