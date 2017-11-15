import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';

export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}

export function equalto(key: string, confirmKey: string) {
  return (group: FormGroup): { [key: string]: any } => {
    let control = group.controls[key];
    let confirmcontrol = group.controls[confirmKey];
    if (control.value !== confirmcontrol.value) 
    { 
      return { keyName: true };
    }
  }
}