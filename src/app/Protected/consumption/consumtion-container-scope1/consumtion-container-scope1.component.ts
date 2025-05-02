import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { AuxHelpingTextsService } from '../../../services/aux-helping-texts.service';
import { AuxTextDTO } from '../../../models/auxText.dto';

@Component({
  selector: 'app-consumtion-container-scope1',
  templateUrl: './consumtion-container-scope1.component.html',
  styleUrl: './consumtion-container-scope1.component.scss'
})
export class ConsumtionContainerScope1Component {
  @Input() activityYear: number = 0
  @Input() productionCenter: number = 0
  translatedScopeOneEmissions: string = ''
  selectedTabIndexscope1: number = 0
  token: string = ''
 
  organizacionID!: number
  availableYears: string[] = [];
  currentActivityYear: string = ''
  auxText: AuxTextDTO | undefined
  title: string = ''
  text: string = ''
  
  constructor (public dialog: MatDialog,
    private auxHelpingTextsService: AuxHelpingTextsService) { }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1')
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope1 = +savedTabIndex;
    }
  }

  onTabChange(index: number) {
    localStorage.setItem('selectedTabIndexscope1', index.toString());
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
