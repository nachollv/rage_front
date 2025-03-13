import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const retypePassword = control.get('retypePassword');
    if (password && retypePassword && password.value !== retypePassword.value) {
      return { 'notSame': true };
    }
    return null;
  };
}