import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title = 'RAGE: ';
  bold = false;
  italic = false;

  menuOptions = ["{{'fugitiveEmissions' | translate}}", 'processEmissions', 'AdditionalInformation', 'ElectricityAndOtherEnergies', 'FinalReport', '<hr>EmisionFactors'];
  selectedSize: string | undefined = 'Normal';

  reset() {
    this.bold = false;
    this.italic = false;
    this.selectedSize = 'Normal';
  }
  
  constructor(private translate: TranslateService, private router: Router, public dialog: MatDialog) {
    this.translate.setDefaultLang('es');
  }

  switchLanguage(language: string) {
    this.translate.use(language)
  }

  goHome () {
    this.router.navigate([''])
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


