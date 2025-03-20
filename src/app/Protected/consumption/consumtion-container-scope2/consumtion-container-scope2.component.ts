import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';

@Component({
  selector: 'app-consumtion-container-scope2',
  templateUrl: './consumtion-container-scope2.component.html',
  styleUrl: './consumtion-container-scope2.component.scss'
})
export class ConsumtionContainerScope2Component {
  selectedTabIndexscope2: number = 0;
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1');
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope2 = +savedTabIndex;
    }
  }

  onTabChange(index: number) {
    localStorage.setItem('selectedTabIndexscope2', index.toString());
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
