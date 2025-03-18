import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, } from '@angular/forms';
import { passwordMatchValidator } from '../custom-validators/custom.validator';
import { OrganizacionService } from '../services/organizacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; /* ! operador de aserción no nulo (!) para indicar que registerForm será inicializado antes de ser utilizado. */
  submitted:boolean = false;
  constructor(private fb: FormBuilder, private registerService: OrganizacionService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,  
        Validators.minLength(6),
        this.hasUppercase,
        this.hasNumber,
        this.hasSpecialCharacter,]],
      retypePassword: ['', [Validators.required, Validators.minLength(6), passwordMatchValidator]],
      nif: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      companyName: ['', [Validators.required]],
      postalCode: ['', [Validators.minLength(5), Validators.maxLength(5)]]
    });
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
  this.submitted = true;

  if (this.registerForm.valid) {
    const formData = this.registerForm.value;

    // Llama al servicio para registrar la organización
    this.registerService.crearOrganizacion(formData).subscribe(
      (response) => {
        this.showSnackBar('Registro exitoso:' + response)

      },
      (error) => {
        this.showSnackBar('Error en el registro:' + error)
      }
    );
  } else {
    this.showSnackBar('Formulario inválido')
  }
}

private showSnackBar(error: string): void {
  this.snackBar.open(error, 'Close', {
    duration: 1500,
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
    panelClass: ['custom-snackbar'],
  });
}
}