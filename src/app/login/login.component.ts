import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  role: string = ''

  constructor(
    private jwtHelper: JwtHelperService,
    private fb: FormBuilder, private router: Router, 
    private authService: AuthService, private snackBar: MatSnackBar) { 
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
        this.role = this.jwtHelper.decodeToken(response.token).data.rol === 'Admin' ? 'Admin' : 'User'
        this.authService.setRole(this.role)
        this.authService.saveToken(response.token)

        this.showSnackBar("Bienvenido a la aplicación RAGE, un momento...")
        this.router.navigate(['/dashboard']).then(() => { window.location.reload(); });
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
