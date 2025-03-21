import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private baseUrl = `https://restcountries.com/v3.1`
  httpClient = inject(HttpClient);

  private _regions = [
    'Africa',
    'Americas',
    'Asia',
    'Europa',
    'Oceania'
  ]

  //Retornar un nuevo arreglo para que al modificarlo no se modifique la propiedad original
  get regions(): string[]{
    return [...this._regions]
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if(!region) return of([])

    return this.httpClient.get<Country[]>(`${this.baseUrl}/region/${region}?fields=cca3,name,borders`);
  }

  getCountryByAlphaCode(alphaCode: string): Observable<Country>{
    return this.httpClient.get<Country>(`${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`);
  }

  getCountryBorderByCodes(borders: string){
    
  }
}
