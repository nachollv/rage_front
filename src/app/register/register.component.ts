import { Component, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../custom-validators/custom.validator';
import { OrganizacionService } from '../services/organizacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignUpMailService } from '../sign-up-mail.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent  {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, 
    private registerService: OrganizacionService, 
    private signUpMailService: SignUpMailService,
    private router: Router, private cdr: ChangeDetectorRef) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      retypePassword: ['', [Validators.required]],
      cif: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      companyName: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]}, 
      { validators: passwordMatchValidator }
    );
    this.registerForm.get('retypePassword')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity({ onlySelf: false });
    });
  }

  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
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

    return Object.keys(errors).length ? errors : null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      formData.nombre = this.registerForm.get('companyName')?.value;
      formData.rol = 'Admin';
      formData.daysPasswordDuration = 60;

      this.registerService.crearOrganizacion(formData).subscribe(
        (response) => {
          this.showSnackBar('Su empresa ha sido registrada correctamente.');
          const email = this.registerForm.value.email;
      this.signUpMailService.sendSignUpEmail(email).subscribe({
        next: (response) => {
          this.showSnackBar('Correo enviado exitosamente. Revisa tu bandeja de entrada.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.showSnackBar('Hubo un problema al enviar el correo.<br>' + error + '<br>Por favor, intenta de nuevo en un momento.');
        },
      })
          
        },
        (error) => {
          this.showSnackBar('Error en el registro: ' + error.messages);
        }
      );
    } else {
      this.showSnackBar('Formulario inválido');
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar'],
    });
  }
}
