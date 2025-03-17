import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loginResult: string = ""
  firstLogin: boolean = false
  email:string = '';
  password:string = '';
  errorMessage:string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private snackBar: MatSnackBar,) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
   
  }
  
  onSubmit(): void {
    this.authService.login(this.loginForm.get('email')!.value, this.loginForm.get('password')!.value).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token); // Almacena el token
        this.showSnackBar("Bienvenido a la aplicación RAGE, un momento...")
        setTimeout(() => {
           this.router.navigate(['/dashboard']); // Redirige a otra página
        }, 1500);
       
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas. Intenta de nuevo.'+err.error.message;
        this.showSnackBar(this.errorMessage)
      }
    });
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
