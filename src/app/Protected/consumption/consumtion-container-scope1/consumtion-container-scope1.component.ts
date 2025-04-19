import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { TranslationService } from '../../../services/translate.service';
import { AuthService } from '../../../services/auth.service';
import { ProductioncenterService } from '../../../services/productioncenter.service';
import { OrganizacionService } from '../../../services/organizacion.service';
import { AuxHelpingTextsService } from '../../../services/aux-helping-texts.service';
import { AuxTextDTO } from '../../../models/auxText.dto';
import { FormBuilder } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  
  constructor (public dialog: MatDialog, private fb: FormBuilder,
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private auxHelpingTextsService: AuxHelpingTextsService,
    private snackBar: MatSnackBar,
    /* private productionCenterService: ProductioncenterService,
    private organizationService: OrganizacionService,
    private translate: TranslationService */) {
    /*   this.productionCenterForm = this.fb.group({
      activityYear: [{ value: '' }],
      productionCenter: [{value: '', disabled: true}],
    }); */

    }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1')
    this.token = this.authService.getToken() || ''
    this.productionCenter = this.jwtHelper.decodeToken(this.token).data.id
    this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope1 = +savedTabIndex;
    }

    /* this.getOrganizacionActivityYears( this.organizacionID )
    this.getProductionCenterDetails( +this.prodCenterID ) */
  }

/*   getProductionCenterDetails(id:number) {
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
      })  
   } */

  onTabChange(index: number) {
    localStorage.setItem('selectedTabIndexscope1', index.toString());
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

}
