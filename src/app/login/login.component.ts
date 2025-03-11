import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loginResult: string = ""
  firstLogin: boolean = false

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    });
  }

  ngOnInit(): void {
   
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form Submitted:', this.loginForm.value)
      this.loginResult = this.loginForm.value.email + " " + this.loginForm.value.password
      if (this.firstLogin) {
      this.router.navigate(['/organ-gen-data']);
      } else {
        this.router.navigate(['control-panel-container'])
      }
    }
  }

  login() {
    // Lógica para autenticar al usuario y obtener el token
    const token = 'jwt-token-obtenido-del-servidor';
    this.authService.setToken(token);
  }
}
