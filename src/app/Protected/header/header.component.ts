import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title = 'RAGE: ';
  viewUserMenu: boolean = true
  role: string = 'User' // Rol del usuario
  userName: string = '' // Nombre del usuario
  menuItems: string[] = [] // Opciones del menú
  decodedToken: any;
  
    constructor(
    private jwtHelper: JwtHelperService,
    private translate: TranslateService, 
    private router: Router, public dialog: MatDialog
    ) {
    this.translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken')
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token)
      this.role = this.decodedToken.data.rol
      this.userName = this.decodedToken.data.nombre
    } else {
      console.log('Token no encontrado');
    }
  
      if (this.role === 'Admin') {
        this.menuItems = ['Dashboard', 'Users', 'Settings'];
        this.viewUserMenu = !this.viewUserMenu
      } else if (this.decodedToken.data.rol === 'User') {
        this.menuItems = ['Home', 'Profile', 'Help'];
      }
 
  }

  switchLanguage(language: string) {
    this.translate.use(language)
  }

  goHome () {
    this.router.navigate([''])
  }

  logout() {
    localStorage.removeItem('authToken'); // Elimina el token del usuario
    this.router.navigate(['login']); // Redirige al usuario a la página de inicio de sesión
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Título del Dialog',
        text: 'Este es el texto del Dialog.',
        position: 'center'
      },
      /* position: { top: '20%', left: '20%' } ,*/ // Ajusta la posición según tus necesidades
      width: '400px',
      height: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialog se cerró');
    });
  }
}


