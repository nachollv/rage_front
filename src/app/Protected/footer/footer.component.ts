import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(public dialog: MatDialog) {}

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
