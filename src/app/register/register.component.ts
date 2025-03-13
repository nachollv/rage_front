import { Component, OnInit } from '@angular/core';
import {     FormBuilder,
  FormGroup,
  Validators,
  AbstractControl, } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; /* ! operador de aserción no nulo (!) para indicar que registerForm será inicializado antes de ser utilizado. */

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,  
        Validators.minLength(6),
        this.hasUppercase,
        this.hasNumber,
        this.hasSpecialCharacter,]],
      retypePassword: ['', [Validators.required, Validators.minLength(8)]],
      nif: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      companyName: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
        return { passwordMismatch: true };
    }
    return null;
  }

   // Custom validator to check if the password contains at least one uppercase letter
   hasUppercase(control: AbstractControl) {
    const value = control.value;
    if (value && !/[A-Z]/.test(value)) {
        return { uppercase: true };
    }
    return null;
}

// Custom validator to check if the password contains at least one number
hasNumber(control: AbstractControl) {
    const value = control.value;
    if (value && !/\d/.test(value)) {
        return { number: true };
    }
    return null;
}

// Custom validator to check if the password contains at least one special character
hasSpecialCharacter(control: AbstractControl) {
    const value = control.value;
    if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return { specialCharacter: true };
    }
    return null;
}

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Form Submitted', this.registerForm.value);
      // Aquí puedes agregar la lógica para manejar el registro
    }
  }
}