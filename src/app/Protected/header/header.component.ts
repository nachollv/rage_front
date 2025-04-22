import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';

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
  scope1:boolean = true
  scope2:boolean = false
  
    constructor(
    private jwtHelper: JwtHelperService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router, public dialog: MatDialog
    ) {
      this.translate.setDefaultLang('es-ES'); // Establece el idioma por defecto
      const preferredLang = localStorage.getItem('preferredLang');
      if (preferredLang) {
        this.translate.use(preferredLang); // Cambia el idioma según la preferencia del usuario
      } else {
        this.translate.use('es-ES'); // Si no hay preferencia, usa el idioma por defecto
      }
      this.translate.setDefaultLang('es-ES'); // Establece el idioma por defecto
  }

  ngOnInit(): void {
    /* const token = localStorage.getItem('authToken') */
    const token = this.authService.getToken()
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token)
      this.role = this.decodedToken.data.rol
      this.userName = this.decodedToken.data.nombre
    } else {
      console.log('Token no encontrado');
    }
  
      if (this.role === 'Admin') {
        this.menuItems = ['Dashboard', 'Users', 'Settings'];
      } else if (this.decodedToken.data.rol === 'User') {
        this.menuItems = ['Home', 'Profile', 'Help'];
      }
  }

  switchLanguage(language: string) {
    localStorage.setItem('preferredLang', language)
    this.translate.setDefaultLang(language);
    this.translate.use(language)
  }

  switchScope() {
   this.scope1 = !this.scope1
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
      console.log('El diálogo se cerró');
    });
  }
}


