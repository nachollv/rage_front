import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit {
  recoveryForm!: FormGroup; // El formulario reactivo
  message: string = ''; // Mensaje de retroalimentación

  constructor(private fb: FormBuilder, private http: HttpClient) {}

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
      const requestData = { email: this.recoveryForm.value.email };

      this.http
        .post('https://your-api-endpoint/recovery-password', requestData)
        .subscribe({
          next: (response: any) => {
            this.message = 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña.';
          },
          error: (err: any) => {
            this.message = 'Hubo un error al enviar el correo. Por favor, verifica el correo ingresado.';
          }
        });
    }
  }
}
