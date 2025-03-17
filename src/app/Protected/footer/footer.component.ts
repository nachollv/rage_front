import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  role: string = 'User'
  userName: string = ''
  decodedToken: any

  constructor( private jwtHelper: JwtHelperService, public dialog: MatDialog ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken')
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token)
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
