import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { catchError, filter, map, of, Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [JsonPipe,ReactiveFormsModule],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  fb = inject(FormBuilder);
  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);

  countriesByRegion = signal<Country[]>([]);
  countriesBorders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  //Efecto que se va a realizar siempre que un valor cambie
  onFormChange = effect((onCleanup) => {
    const formSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChange();

    onCleanup(() => {
      formSubscription.unsubscribe();
      countrySubscription.unsubscribe();
      console.log('Limpiado');
    })
  })

  //Método que devuelve la suscripción
  onRegionChanged(): Subscription{
    return this.myForm.get('region')!.valueChanges
    //Pipes para utilizar los datos antes de resolverse
    .pipe(
      //Efectos que limpian el select a ninguno antes de que entre la suscripción
      tap(() => this.myForm.get('country')?.setValue('')),
      tap(() => this.myForm.get('border')?.setValue('')),
      //Efectos en un solo tap que van a limpiar los datos de countries borders 
      tap(() => {
        this.countriesBorders.set([]);
        this.countriesByRegion.set([])
      }),
      //Cambia el observable original por el que se utilice aquí alterando el flujo y fuente de datos
      switchMap(region => this.countryService.getCountriesByRegion(region ?? '').pipe(catchError(()=> of([]))))
    )
    .subscribe(countries => {
      this.countriesByRegion.set(countries);
    })
  }

  onCountryChange(){
    return this.myForm.get('country')!.valueChanges
    .pipe(
      //Asignar un valor vacío si value es indefinido
      map((value) => {
        return (!value)? '': value;
      }),
      tap(() => this.myForm.get('border')?.setValue('')),
      //Continúa la operación si la evaluación es true
      filter(value => value.length>0),
      //Cambiar el flujo para obtener el resultado del servicio y obtener el país.
      switchMap(alphaCode => this.countryService.getCountryByAlphaCode(alphaCode)),
      //Cambiar el flujo por la petición nuevo que devolverá un arreglo de Country[] buscados por su Code
      switchMap(country => this.countryService.getCountryNameByCodes(country.borders))
    )
    .subscribe( countriesBorders => {
      this.countriesBorders.set(countriesBorders);
      console.log(this.countriesBorders());
    })
  }
  // formRegionChanged = this.myForm.get('region')?.valueChanges.subscribe(value => {
  //   console.log(value);
  // })
}
