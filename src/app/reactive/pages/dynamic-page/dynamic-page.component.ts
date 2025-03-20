import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicPageComponent {
  private fb = inject(FormBuilder)
  formUtils = FormUtils;

  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array([
      ['Metal gear', Validators.required],
      ['Persona 3', Validators.required],
    ], 
    Validators.minLength(2)),
  })

  get favoriteGames(){
    return this.myForm.get('favoriteGames') as FormArray;
  }

  getFieldErrorFromArray(form: FormGroup, array: FormArray, index: number){
    const control = array.controls[index].errors ?? [];
    
    for(let key of Object.keys(control)) {
      
    }
  }
}
