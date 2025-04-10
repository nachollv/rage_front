import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { TranslationService } from '../../../services/translate.service';
import { AuthService } from '../../../services/auth.service';
import { ProductioncenterService } from '../../../services/productioncenter.service';
import { OrganizacionService } from '../../../services/organizacion.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  organizacionID!: number
  availableYears: { id: number, year: number }[] = [];
  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private productionCenterService: ProductioncenterService,
    private organizationService: OrganizacionService,
    private translate: TranslationService) {
     this.productionCenterForm = this.fb.group({
            calculationYear: [{ value: '', disabled: true }],
            productionCenter: [{value: '', disabled: true}],
          });
    }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1')
    this.token = this.authService.getToken() || ''
    this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.id
    this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope1 = +savedTabIndex;
    }
    this.getOrganizacionActivityYears( this.organizacionID )
   /*  this.getProductionCenterDetails( this.prodCenterID ) */
  }

  getProductionCenterDetails(id:number) {
    this.productionCenterService.getCentroDeProduccionByID(id)
      .subscribe((pCenterItem: any) => {
        this.productionCenterForm.patchValue({
          productionCenter: pCenterItem.nombre
        })
      })
  }

  getOrganizacionActivityYears(organizacionID: number) {
    this.organizationService.getActivityYearsByOrganization(organizacionID)
      .subscribe((years: any) => {
        this.availableYears = years
        console.log("años: ", this.availableYears)
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
