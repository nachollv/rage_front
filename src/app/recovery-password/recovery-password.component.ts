import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RecoveryPasswordService } from '../recovery-password.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit {
  recoveryForm!: FormGroup; // El formulario reactivo
  message: string = ''; // Mensaje de retroalimentación

  constructor(private fb: FormBuilder, 
    private http: HttpClient, 
    private recoveryService: RecoveryPasswordService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl() {
    return this.recoveryForm.get('email');
  }

  onSubmit(): void {
    this.message ="Un momento, enviando ..."
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.value.email;
      this.recoveryService.sendRecoveryEmail(email).subscribe({
        next: (response) => {
          this.message = 'Correo enviado exitosamente. Revisa tu bandeja de entrada.';
          this.showSnackBar(this.message)
        },
        error: (error) => {
          this.message = 'Hubo un problema al enviar el correo.<br>'+error+"<br>Por favor, intenta de nuevo en un momento.";
          this.showSnackBar(error)
        },
      });
    }
  }

  private showSnackBar(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 15000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar'],
    });
  }
}
