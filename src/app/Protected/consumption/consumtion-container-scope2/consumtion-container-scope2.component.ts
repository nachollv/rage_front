import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductioncenterService } from '../../../services/productioncenter.service';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuxHelpingTextsService } from '../../../services/aux-helping-texts.service';
import { AuxTextDTO } from '../../../models/auxText.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consumtion-container-scope2',
  templateUrl: './consumtion-container-scope2.component.html',
  styleUrl: './consumtion-container-scope2.component.scss'
})
export class ConsumtionContainerScope2Component {
  selectedTabIndexscope2: number = 0;
  productionCenterForm: FormGroup;
  token: string = ''
  auxText: AuxTextDTO | undefined
  title: string = ''
  text: string = ''
  @Input() scope2?: boolean | undefined;

  constructor (public dialog: MatDialog, private productionCenterService: ProductioncenterService,
    private auxHelpingTextsService: AuxHelpingTextsService,
    private snackBar: MatSnackBar,
     private jwtHelper: JwtHelperService,
  ) {
    this.productionCenterForm = new FormBuilder().group({
      calculationYear: [{ value: '2023', disabled: true }],
      productionCenter: [{ value: '2', disabled: true }],
    });
  }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1')
   /*  this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.idCentroProduccion */
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope2 = +savedTabIndex;
    }
    this.getProductionCenterDetails(this.productionCenterForm.get('productionCenter')!.value)
  }

  getProductionCenterDetails(id:number) {
    this.productionCenterService.getCentroDeProduccionByID(id)
      .subscribe((pCenterItem: any) => {
        this.productionCenterForm.patchValue({
          productionCenter: pCenterItem.nombre
        })
      })
  }

  onTabChange(index: number) {
    localStorage.setItem('selectedTabIndexscope2', index.toString());
  }

   openDialog( id: any ): void {
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
}
