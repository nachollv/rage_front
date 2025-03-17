import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title = 'RAGE: ';

  role: string = '' // Rol del usuario
  menuOptions: string[] = [] // Opciones del menú
  selectedSize: string | undefined = 'Normal'
  viewUserMenu: boolean = true

  constructor(private jwtHelper: JwtHelperService, private translate: TranslateService, private router: Router, public dialog: MatDialog) {
    this.translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    this.setUserRole();
    this.setMenuOptions();
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

  private setUserRole(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.role = decodedToken.data['rol'] || 'User'; // Establece el rol predeterminado como "User"
    }
  }

  private setMenuOptions(): void {

      if (this.role === 'Admin') {
      /* this.menuOptions = ['usermanagement', 'viewUserList', 'dashboard']; */
      this.viewUserMenu = false
    } else {
      this.viewUserMenu = true

     /*  this.menuOptions = ['activityRegistration', 'bashboard', 'recoverPassword', 'predefinedLanguage', 'passwordValidity']; */
    }
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


