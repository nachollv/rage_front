import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../../dialog/dialog.component';
import { AuthService } from '../../services/auth.service';
import { ProductioncenterService } from '../../services/productioncenter.service';
import { OrganizacionService } from '../../services/organizacion.service';
import { AuxHelpingTextsService } from '../../services/aux-helping-texts.service';
import { AuxTextDTO } from '../../models/auxText.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrl: './consumption.component.scss'
})
export class ConsumptionComponent {
  productionCenterForm: FormGroup;
  token: string = ''
  prodCenterID: number = 0
  prodCenterName: string = ''
  organizacionID: number = 0
  availableYears: number[] = [];
  currentActivityYear: string = ''
  auxText: AuxTextDTO | undefined
  title: string = ''
  text: string = ''
  scope1: boolean = true
  scope2: boolean = false
  selectedActivityYear: number = 0

  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private auxHelpingTextsService: AuxHelpingTextsService,
    private snackBar: MatSnackBar,
    private productionCenterService: ProductioncenterService,
    private organizationService: OrganizacionService) {
     this.productionCenterForm = this.fb.group({
      activityYear: [{ value: '' }, [Validators.required]],
      /* productionCenter: [{value: '', disabled: true}], */
    });
  }

  ngOnInit() {
  this.route.params.subscribe(params => {
    if (params['scope']==='one') {
      this.scope1 = true
      this.scope2 = false
    }
    else if (params['scope']==='two') {
      this.scope1 = false
      this.scope2 = true
    }
  });
  this.token = this.authService.getToken() || ''
  this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.id
  this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
  this.getOrganizacionActivityYears( this.organizacionID )
  this.getProductionCenterDetails( this.prodCenterID )
  }

  getProductionCenterDetails(id:number) {
    this.productionCenterService.getCentroDeProduccionByID(id)
      .subscribe((pCenterItem: any) => {
        this.prodCenterName = pCenterItem.nombre

      })
  }

  getOrganizacionActivityYears(organizacionID: number) {
    this.organizationService.getActivityYearsByOrganization(organizacionID)
      .subscribe((years: any) => {
        this.currentActivityYear = years.data[0]
        this.availableYears = this.currentActivityYear.split(", ").map(Number)
      })  
   }

  onYearChange(event: any): void {
    this.selectedActivityYear = event.value
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
