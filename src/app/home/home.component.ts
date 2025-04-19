import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuxHelpingTextsService } from '../services/aux-helping-texts.service';
import { AuxTextDTO } from '../models/auxText.dto';

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
  constructor( public dialog: MatDialog,
    private auxHelpingTextsService: AuxHelpingTextsService
   ) {
    this.getAuxText(999)
   }

  openDialog( id: number ): void {
    this.auxHelpingTextsService.getAuxTextById(id).subscribe((text: AuxTextDTO | undefined) => {
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
    });

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: this.title,
        text: this.text,
        position: 'center'
      },
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialog se cerró');
    });
  }

  getAuxText(id:number) {
    this.auxHelpingTextsService.getAuxTextById(id).subscribe((text: AuxTextDTO | undefined) => {
      if (text) {
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
        this.homeIntro = this.title+"<br>"+this.text
      } else {
        console.error('Texto auxiliar no encontrado');
      }
    });
  }

}
