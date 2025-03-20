import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static getTextError(errors: ValidationErrors){
    for(const key of Object.keys(errors)){
      switch(key){
        case 'required':
          return 'Este campo es requerido';
        
        case 'minlength':
          return `La longitud debe de ser de ${errors['minlength'].requiredLength}.`
        
        case 'min':
          return `Valor mínimo ${errors['min'].min}`
        
        case 'email':
          return 'Este campo debe tener un formato de correo válido.'
      }
    }

    return null;
  }

  static isValidField(fieldName: string, form: FormGroup): boolean | null {
    return form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static getFieldError(fieldName: string, form: FormGroup): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number){
    return (formArray.controls[index].errors && formArray.controls[index].touched)
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    //Si no hay elementos en el arreglo...
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};


    return FormUtils.getTextError(errors);
  }
}
