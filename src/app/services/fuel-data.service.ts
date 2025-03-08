import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FuelDataService {

  private dataUrl = '/assets/emission-factors.json';

  constructor(private http: HttpClient) { }

  getFuelData(year: string, fuelType: string): Observable<number | undefined> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data[year]?.[fuelType])
    );
  }
}