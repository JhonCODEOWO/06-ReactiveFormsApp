import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';
import { combineLatest, Observable, of } from 'rxjs';

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

  //Realizar petición por AlphaCode mediante un arreglo de strings NOTA: Si falla alguno de los observable toda la operación fallará.
  getCountryNameByCodes(countryCodes: string[]): Observable<Country[]>{
    //Validar que el arreglo de country codes esté definido y tenga valores
    if(!countryCodes || countryCodes.length == 0) return of([]);

    //Arreglo de observables que dan de respuesta un objeto country agrupados en un arreglo
    const countriesRequest: Observable<Country>[] = [];

    //Recorrer arreglo de strings
    countryCodes.forEach((code) =>{

      //Generar una request observable a la búsqueda por alpha code sin suscripción
      const request = this.getCountryByAlphaCode(code);

      //Almacenar petición en el arreglo de observables
      countriesRequest.push(request);
    })

    //Retornar un observable que va a resolver todas las peticiones.
    return combineLatest(countriesRequest);
  }
}
