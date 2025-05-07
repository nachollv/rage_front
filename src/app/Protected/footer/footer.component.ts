import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  role: string = 'User'
  userName: string = ''
  decodedToken: any
  token: string = ''
  isExpiredToken: boolean = false

  constructor( private jwtHelper: JwtHelperService, 
              private authService: AuthService, 
              public dialog: MatDialog ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken() || ''
    this.isExpiredToken = this.jwtHelper.isTokenExpired(this.token)
    if ( !this.isExpiredToken ) {
      this.decodedToken = this.jwtHelper.decodeToken(this.token)
      this.role = this.decodedToken.data.rol
      this.userName = this.decodedToken.data.nombre
    } else {
     this.role = ""
     this.userName = ""
    }
  
    
  }

  openDialog(title:string, text: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        text: text,
        position: 'center'
      },
      width: '400px',
      height: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialog se cerró');
    });
  }

}
