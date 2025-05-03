import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const retypePassword = form.get('retypePassword')?.value;

  if (password && retypePassword && password !== retypePassword) {
    console.log (password, retypePassword)
    return { passwordsMismatch: true }; // Se devuelve el error
  } else {
    return null;
  }
}

