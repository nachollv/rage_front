import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { TranslationService } from '../../../services/translate.service';
import { ProductioncenterService } from '../../../services/productioncenter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-consumtion-container',
  templateUrl: './consumtion-container.component.html',
  styleUrl: './consumtion-container.component.scss'
})
export class ConsumtionContainerComponent {
  translatedScopeOneEmissions?: string | undefined;
  selectedTabIndexscope1: number = 0;
  productionCenterForm: FormGroup;
  token: string = ''
  prodCenterID!: number

  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private jwtHelper: JwtHelperService,
    private productionCenterService: ProductioncenterService,
    private translate: TranslationService) {
     this.productionCenterForm = this.fb.group({
            calculationYear: [{ value: '', disabled: true }],
            productionCenter: [{value: '', disabled: true}],
          });
    }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1');
    this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.idCentroProduccion
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope1 = +savedTabIndex;
    }
    this.getProductionCenterDetails( this.prodCenterID)
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
