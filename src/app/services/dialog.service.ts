import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuxHelpingTextsService } from '../services/aux-helping-texts.service';
import { AuxTextDTO } from '../models/auxText.dto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog, private auxHelpingTextsService: AuxHelpingTextsService) {}

  openDialog(id: any): Observable<void> {
    return new Observable<void>((observer) => {
      this.auxHelpingTextsService.getAuxTextById(id)
        .subscribe((text: AuxTextDTO | undefined) => {
          if (text) {
            let title = '';
            let sectionText = '';

            const preferredLang = localStorage.getItem('preferredLang');
            switch (preferredLang) {
              case 'es':
                title = text.titleES;
                sectionText = text.sectionTextES;
                break;
              case 'ca':
                title = text.titleCA;
                sectionText = text.sectionTextCA;
                break;
              case 'en':
                title = text.titleEN;
                sectionText = text.sectionTextEN;
                break;
              default:
                console.error('Idioma no soportado');
                observer.complete();
                return;
            }

            this.dialog.open(DialogComponent, {
              data: {
                title: title,
                text: sectionText,
                position: 'center'
              },
              width: '450px',
            });

            observer.next(); // Indicar que la operación se completó correctamente
          } else {
            console.error('Texto auxiliar no encontrado');
          }
          observer.complete();
        });
    });
  }
}
