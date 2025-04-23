import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { passwordMatchValidator } from '../custom-validators/custom.validator';
import { OrganizacionService } from '../services/organizacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent  {
  registerForm!: FormGroup;


  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private registerService: OrganizacionService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [ Validators.required, Validators.minLength(6), this.passwordValidator
      ]],
      retypePassword: ['', Validators.required],
      cif: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      companyName: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    }, { validators: this.passwordsMatchValidator });

    this.registerForm.get('retypePassword')?.valueChanges.subscribe(() => {
      const password = this.registerForm.get('password')?.value;
      const retypePassword = this.registerForm.get('retypePassword')?.value;
    
      if (password !== retypePassword) {
        this.registerForm.setErrors({ passwordsMismatch: true });
      } else {
        this.registerForm.setErrors(null);
      }
    });
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const retypePassword = group.get('retypePassword')?.value;
  
    console.log('Password:', password); // Para depuración
    console.log('RetypePassword:', retypePassword); // Para depuración

    if (password === retypePassword) {
      return null; // No hay error
    } else {
      return { passwordsMismatch: true }; // Error encontrado
    }
  }
   

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const errors: ValidationErrors = {};
    
    if (!/[A-Z]/.test(password)) {
      errors['uppercase'] = true;
    }
    if (!/[a-z]/.test(password)) {
      errors['lowercase'] = true;
    }
    if (!/\d/.test(password)) {
      errors['number'] = true;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors['specialCharacter'] = true;
    }
    console.log('Password errors:', errors); // Para verificar el resultado
    return Object.keys(errors).length ? errors : null;
  }
  

onSubmit(): void {

  if (this.registerForm.valid) {
    const formData = this.registerForm.value;
    formData.nombre = this.registerForm.get('companyName')?.value;
    formData.rol = 'Admin'
    formData.daysPasswordDuration = 60
    // Llama al servicio para registrar la organización
    this.registerService.crearOrganizacion(formData).subscribe(
      (response) => {
        this.showSnackBar('Su empresa ha sido registada correctamente.')
        this.router.navigate(['/login'])
      },
      (error) => {
        this.showSnackBar('Error en el registro:' + error.messages)
      }
    );
  } else {
    this.showSnackBar('Formulario inválido')
  }
}

private showSnackBar(error: string): void {
  this.snackBar.open(error, 'Close', {
    duration: 5000,
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
    panelClass: ['custom-snackbar'],
  });
}
}