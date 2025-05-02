import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuxHelpingTextsService } from '../services/aux-helping-texts.service';
import { AuxTextDTO } from '../models/auxText.dto';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  auxText: AuxTextDTO | undefined
  homeIntro: string = ''
  title: string = ''
  text: string = ''
  preferredLang: string = localStorage.getItem('preferredLang') || 'es'
  constructor( public dialog: MatDialog,
    private auxHelpingTextsService: AuxHelpingTextsService
   ) {
    switch (this.preferredLang) {

      case 'es':  
      case 'es-ES': 
        this.preferredLang = 'es'
        break;
      case 'ca':
      case 'ca-ES': 
        this.preferredLang = 'ca'
        break;
      case 'en':
      case 'en-EN':   
        this.preferredLang = 'en'
        break;
      default:    
        this.preferredLang = 'es'
        break;
   }
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

  getAuxText(id:number) {
    this.auxHelpingTextsService.getAuxTextById(id).subscribe((text: AuxTextDTO | undefined) => {
      if (text) {
        if (localStorage.getItem('preferredLang') === 'es-ES' || localStorage.getItem('preferredLang') === 'es') {
         this.title = text.titleES
         this.text = text.sectionTextES
        } else if (localStorage.getItem('preferredLang') === 'ca-ES' || localStorage.getItem('preferredLang') === 'ca') {
          this.title = text.titleCA
          this.text = text.sectionTextCA
        } else if (localStorage.getItem('preferredLang') === 'en-EN' || localStorage.getItem('preferredLang') === 'en') {
          this.title = text.titleEN
          this.text = text.sectionTextEN
        } else {
          console.error('Idioma no soportado')
        }
        this.homeIntro = "<h3>"+this.title+"</h3><br>"+this.text
      } else {
        console.error('Texto auxiliar no encontrado');
      }
    });
  }

}
