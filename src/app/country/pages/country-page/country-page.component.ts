import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';

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

    onCleanup(() => {
      formSubscription.unsubscribe();
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
    .subscribe({
      next: countries => {
        this.countriesByRegion.set(countries);
      },
      error: (error) => {
        console.log('Ha ocurrido un error');
      }
    })
  }
  // formRegionChanged = this.myForm.get('region')?.valueChanges.subscribe(value => {
  //   console.log(value);
  // })
}
