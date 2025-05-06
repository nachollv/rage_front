import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  deleted_at: Date | null;
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
    displayedColumns: string[] = ['Centro de producción', 'E·mail', 'Rol', 'Último inicio de sesión', 'La contraseña caduca el', 'edit', 'delete']
    data = [{ }]
    dataSource = new MatTableDataSource<any>(this.data)

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
        this.users = users
        console.log(this.users)
        this.users.forEach((registro: any) => {
          registro.edit = true
          registro.delete = true
          registro['Centro de producción'] = registro.nombre
          registro['E·mail'] = registro.email
          registro['Rol'] = registro.rol
          registro['Último inicio de sesión'] = registro.ultimo_inicio_sesion
          registro['La contraseña caduca el'] = registro.caducidad_contrasena
        this.dataSource = new MatTableDataSource(this.users)
        this.showSnackBar('Se han encontrado ' + users.length + ' centros de producción para esta organización');
        })
      },
      (error) => {
        console.error('Error al obtener los centros de producción de la organización:', error.message); // Registrar el error
        this.showSnackBar('No se pudieron obtener los centros de producción de la organización. Intente más tarde. '+error.message);
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
      this.userService.createUser(userData)
      .subscribe({
        next: (response) => { 
          const newUser: User = { id: Date.now(), ...this.userForm.value }
          this.users.push(newUser)
          this.userForm.reset()
          this.showSnackBar("Información: "+response.message)

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
      this.userForm.value.nombre.toUpperCase()
      this.userService.updateUser(this.users[this.editingIndex].id, this.userForm.value)
      .subscribe({
        next: (response) => { 
          if (this.editingIndex !== null) {
            this.users[this.editingIndex] = { ...this.userForm.value, id: this.users[this.editingIndex].id };
          }
          this.userForm.reset()
          this.showSnackBar("Información: "+response.message)
        },
        error: (err) => { this.showSnackBar("Error al actualizar el registro "+err.message) } 
      })
    }
  }

  deleteUser(index: number) {
    this.userService.deleteUser(this.users[index].id).subscribe({
      next: (response) => { 
        this.users.splice(index, 1)
        this.showSnackBar("Información: "+response.message)
      }
      , error: (err) => { this.showSnackBar("Error al eliminar el registro "+err.message) } 
    })
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
