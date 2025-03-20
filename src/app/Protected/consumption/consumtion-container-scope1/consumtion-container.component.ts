import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { TranslationService } from '../../../services/translate.service';

@Component({
  selector: 'app-consumtion-container',
  templateUrl: './consumtion-container.component.html',
  styleUrl: './consumtion-container.component.scss'
})
export class ConsumtionContainerComponent {
  translatedScopeOneEmissions?: string | undefined;
  selectedTabIndexscope1: number = 0;
  constructor(public dialog: MatDialog, private translate: TranslationService) { }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1');
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope1 = +savedTabIndex;
    }
  }

  onTabChange(index: number) {
    localStorage.setItem('selectedTabIndexscope1', index.toString());
  }

  openDialog( title: string, text: string ): void {
    this.translate.getTranslation(text).subscribe((translation: string) => {
      text = translation;
      console.log (text)
    })
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        text: text,
        position: 'center'
      },
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialog se cerró');
    });
  }

}
