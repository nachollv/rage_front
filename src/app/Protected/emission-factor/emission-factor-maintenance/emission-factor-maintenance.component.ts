import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { AuxHelpingTextsService } from '../../../services/aux-helping-texts.service';
import { AuxTextDTO } from '../../../models/auxText.dto';

@Component({
  selector: 'app-emission-factor-maintenance',
  templateUrl: './emission-factor-maintenance.component.html',
  styleUrl: './emission-factor-maintenance.component.scss'
})
export class EmissionFactorMaintenanceComponent {
  auxText: AuxTextDTO | undefined
  title: string = ''
  text: string = ''
  selectedTabIndexFE: number = 0

  constructor (public dialog: MatDialog,
    private auxHelpingTextsService: AuxHelpingTextsService) { }

    ngOnInit() {
      const savedTabIndex = localStorage.getItem('selectedTabIndexFE')
      if (savedTabIndex !== null) {
        this.selectedTabIndexFE = +savedTabIndex;
      }
    }    

    onTabChange(index: number) {
      localStorage.setItem('selectedTabIndexFE', index.toString());
    }

    openDialog( id: any ): void {
      this.auxHelpingTextsService.getAuxTextById(id)
      .subscribe((text: AuxTextDTO | undefined) => {
        if (text) {
          this.auxText = text
          if (localStorage.getItem('preferredLang') === 'es') {
           this.title = text.titleES
           this.text = text.sectionTextES
          } else if (localStorage.getItem('preferredLang') === 'ca') {
            this.title = text.titleCA
            this.text = text.sectionTextCA
          } else if (localStorage.getItem('preferredLang') === 'en') {
            this.title = text.titleEN
            this.text = text.sectionTextEN
          } else {
            console.error('Idioma no soportado')
          }
        } else {
          console.error('Texto auxiliar no encontrado');
        }
        this.dialog.open(DialogComponent, {
          data: {
            title: this.title,
            text: this.text,
            position: 'center'
          },
          width: '450px',
        });
        
      });
   }

}
