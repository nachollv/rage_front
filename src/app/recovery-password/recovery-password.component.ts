import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RecoveryPasswordService } from '../recovery-password.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit {
  recoveryForm!: FormGroup; // El formulario reactivo
  message: string = ''; // Mensaje de retroalimentación

  constructor(private fb: FormBuilder, private http: HttpClient, private recoveryService: RecoveryPasswordService) {}

  ngOnInit(): void {
    // Configura el formulario reactivo con validaciones
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl() {
    return this.recoveryForm.get('email');
  }

  onSubmit(): void {
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.value.email;
      this.recoveryService.sendRecoveryEmail(email).subscribe({
        next: (response) => {
          this.message = 'Correo enviado exitosamente. Revisa tu bandeja de entrada.';
        },
        error: (error) => {
          this.message = 'Hubo un problema al enviar el correo. Por favor, intenta de nuevo en un momento.';
        },
      });
    }
  }
}
