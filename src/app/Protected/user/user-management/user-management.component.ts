import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../../services/auth.service';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {

  userForm: FormGroup;
  users: User[] = []; // Lista de usuarios
  editingIndex: number | null = null; // Índice del usuario en edición
  decodedToken: any;
  actualID: string = ''
  
  constructor(private fb: FormBuilder, 
    private jwtHelper: JwtHelperService, 
    private authService: AuthService,
    private userService: UserService, private snackBar: MatSnackBar) {
    
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
    const token = this.authService.getToken()
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token)
      this.actualID = this.decodedToken.data.id;
      this.getUsersByOrganization(this.actualID);
    }
    console.log(this.actualID);
    this.getUsersByOrganization(this.actualID);
  }

  getUsersByOrganization(id: string) {
    this.userService.getUsersByOrganization(+id).subscribe(
      (users: User[]) => {
        this.users = users; // Asignar usuarios si la solicitud es exitosa
        this.showSnackBar('Usuarios de la organización obtenidos: ' + users.length);
      },
      (error) => {
        console.error('Error al obtener los usuarios de la organización:', error.message); // Registrar el error
        // Opcional: Mostrar un mensaje de error al usuario
        this.showSnackBar('No se pudieron obtener los usuarios de la organización. Intente más tarde.');
      }
    );
  }
  


  addUser() {
    if (this.userForm.valid) {
      const newUser: User = { id: Date.now(), ...this.userForm.value };
      this.users.push(newUser);
      this.userForm.reset();
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
