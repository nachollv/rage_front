import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../../services/auth.service';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_registro: Date;
  organizacion: number;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {

  userForm: FormGroup;
  users: User[] = []; // Lista de usuarios
  editingIndex: number | null = null; // Índice del usuario en edición
  decodedToken: any;
  actualID: string = ''
  xxDays: number = 0

  constructor(private fb: FormBuilder, 
    private jwtHelper: JwtHelperService, 
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar) {
    
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      fecha_registro: [new Date(), Validators.required],
      id_empresa: [0, Validators.required]
    });
    const token = this.authService.getToken()
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token)
      this.actualID = this.decodedToken.data.id_empresa
      this.xxDays = this.decodedToken.data.daysPasswordDuration
      this.getUsersByOrganization(this.actualID)
    }
    this.getUsersByOrganization(this.actualID)
  }

  getUsersByOrganization(id: string) {
    this.userService.getUsersByOrganization(+id).subscribe(
      (users: User[]) => {
        this.users = users;
        this.showSnackBar('Se han encontrado ' + users.length + ' usuarios para esta organización');
      },
      (error) => {
        console.error('Error al obtener los usuarios de la organización:', error.message); // Registrar el error
        this.showSnackBar('No se pudieron obtener los usuarios de la organización. Intente más tarde. '+error.message);
      }
    );
  }
  
  addUser() {
    if (this.userForm.valid) {
      const userData = this.userForm.value
      userData.id_empresa = this.actualID
      userData.password = this.userService.generatePassword();
      userData.fecha_registro = new Date()
      const fechaConXXDias = new Date(userData.fecha_registro);
      fechaConXXDias.setDate(fechaConXXDias.getDate() + this.xxDays);
      userData.caducidad_contrasena = fechaConXXDias
      console.log("Nueva contraseña generada:", userData.password);
      this.userService.createUser(userData)
      .subscribe({
        next: (response) => { 
          const newUser: User = { id: Date.now(), ...this.userForm.value }
          this.users.push(newUser)
          this.userForm.reset()
          this.showSnackBar("Registro creado correctamente "+response)

          },
        error: (err) => { this.showSnackBar("Error al crear el registro "+err.message) } })
    }
  }

  editUser(index: number) {
    this.editingIndex = index;
    this.userForm.patchValue(this.users[index]);
  }

  updateUser() {
    if (this.userForm.valid && this.editingIndex !== null) {
      this.users[this.editingIndex] = { ...this.users[this.editingIndex], ...this.userForm.value };
      this.editingIndex = null;
      this.userForm.reset();
    }
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
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
