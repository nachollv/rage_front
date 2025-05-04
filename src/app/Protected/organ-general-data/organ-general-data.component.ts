import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

import { MatSnackBar } from '@angular/material/snack-bar';

import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import { OrganizacionService } from '../../services/organizacion.service';
import { ProductioncenterService } from '../../services/productioncenter.service';
import { SectorsDTO } from '../../models/sectors.dto';
import { SectoresEconomicosService } from '../../services/sectores.economicos.service';
import { activityIndexDTO } from '../../models/activityIndex.dto';
import { actRanquingDTO } from '../../models/actRanquing.dto';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EmisionesElectricasEdificiosService } from '../../services/emisiones-electricas-edificios.service';

@Component({
  selector: 'app-organ-general-data',
  templateUrl: './organ-general-data.component.html',
  styleUrl: './organ-general-data.component.scss'
})

export class OrganGeneralDataComponent implements OnInit {
  mustShowDelegations: boolean = false
  displayedColumns: string[] = ['nombre', 'email', 'rol', 'caducidad_contrasena', 'ultimo_inicio_sesion']
  dataSource = new MatTableDataSource<any>()
  organizationForm: FormGroup
  comercializadorasElectricas: any[] = []
  organizationTypes: { id: string, name: string }[] = [
    { id: '1', name: 'Micro' },
    { id: '2', name: 'Pequeña' },
    { id: '3', name: 'Mediana' },
    { id: '4', name: 'Gran empresa' },
    { id: '5', name: 'Administración' },
    { id: '6', name: 'Entidad sin ánimo de lucro' },
    { id: '7', name: 'Otras' }
  ];
  sectors: SectorsDTO[] = []
  objectiveList: string[] = ['Reducción del consumo de energía', 'Minimizar residuos', 'Ahorro de agua', 'Disminución de Emisiones de CO2', 'Aumento del uso de energías renovables'];
  activityIndex: activityIndexDTO[] = [{id: '1', name: 'Producción anual'}, {id: '2', name: 'Consumo energético'}, {id: '3', name: 'Superficie de las instalaciones'}, {id: '4', name: 'Número de empleados'}, {id: '5', name: 'Facturación'}];
  activityRanquing: actRanquingDTO[] = [{id: '1', name: 'Cantidad de datos registrados'}, {id: '2', name: 'Calidad de los datos registrados'}, {id: '3', name: 'Frecuencia de actualización del registro'}];
  token: string = ''
  organizationID!: number
  availableYears: number[] = []
  selectedYears: string = ''
  selectedyearsArray: number[] = []
  activityIndexOrgConfig: string = ""
  activityRanquingOrgConfig: string = ""
  selectedelectricityTradingCompany: string = ''
  selectedelectricityTradingCompanyArray: string[] = []
  
    constructor(private fb: FormBuilder, private snackBar: MatSnackBar,
      private jwtHelper: JwtHelperService,
      private authService: AuthService, 
      private emisionesElectricasservice: EmisionesElectricasEdificiosService,
      private organizationService: OrganizacionService,
      private productionCenterService: ProductioncenterService,
      private sectoresEconomicos: SectoresEconomicosService,
      public dialog: MatDialog) {
      this.organizationForm = this.fb.group({
        id: [{ value: '', disabled: true }],
        cif: [''],
        companyName: [''],
        organizationType: [''],
        comercializadora: [null],
        activityIndex: ['', Validators.required],
        activityRanquing: ['', Validators.required],
        activityYear: [null, Validators.required],
        cnae: [''],
        zipCode: [''],
        multipleProductionCenter: [],
        email: [{ value: '', disabled: true }],
        daysPasswordDuration: ['30', Validators.required],
        created_at: [{ value: '', disabled: true }],
        updated_at: [{ value: '', disabled: true }],
        deleted_at: [{ value: '', disabled: true }],
      });
    }

    ngOnInit(): void {
     if (this.authService.getToken()) {
        this.token = this.authService.getToken()!
      }
      this.organizationID = this.jwtHelper.decodeToken(this.token).data.id_empresa
      this.getTheOrganizationData(this.organizationID)
      this.getSectoresEconomicos()
      this.getAllEmisionesbyYear(2023)
    }

    getTheOrganizationData(id: number) {
      this.organizationService.getOrganizacion(id)
        .subscribe((theOrganization: any) => {
          console.log (theOrganization.organizacion, theOrganization.configuracion, theOrganization.configuracion.length, id)

          if (theOrganization.configuracion.length > 0) {
            this.selectedYears = theOrganization.configuracion[0].activityYears
            this.selectedyearsArray = this.selectedYears.split(", ").map(Number)
            this.activityIndexOrgConfig = theOrganization.configuracion[0].activityIndex
            this.activityRanquingOrgConfig = theOrganization.configuracion[0].activityRanquing
            this.selectedelectricityTradingCompany = theOrganization.configuracion[0].electricityTradingCompany
            this.selectedelectricityTradingCompanyArray = this.selectedelectricityTradingCompany.split(", ").map(String)
          } 
        
  
         
          const data = {
            id: theOrganization.organizacion.id,
            cif: theOrganization.organizacion.cif,
            companyName: theOrganization.organizacion.companyName,
            organizationType: theOrganization.organizacion.organizationType,
            cnae: theOrganization.organizacion.cnae,
            zipCode:theOrganization.organizacion.zipCode,
            multipleProductionCenter: theOrganization.organizacion.multipleProductionCenter,

            activityIndex: this.activityIndexOrgConfig,
            activityRanquing: this.activityRanquingOrgConfig,

            daysPasswordDuration: theOrganization.organizacion.daysPasswordDuration,
            email: theOrganization.organizacion.email,
            created_at: theOrganization.organizacion.created_at,
            updated_at: theOrganization.organizacion.updated_at,
            deleted_at: theOrganization.organizacion.deleted_at,
          };
          this.organizationForm.patchValue(data);
          if (theOrganization.multipleProductionCenter === '1') {
            this.mustShowDelegations = true;
            this.organizationForm.get('multipleProductionCenter')?.setValue('1');
          } else {
            this.mustShowDelegations = false;
            this.organizationForm.get('multipleProductionCenter')?.setValue('0')
          }
          this.availableYears = []
          for (let year = 2019; year <= 2023; year++) {
            this.availableYears.push(year)
          }
          this.organizationForm.patchValue({ activityYear: this.selectedyearsArray }) 
          this.organizationForm.patchValue({ comercializadora: this.selectedelectricityTradingCompanyArray })
        this.getProductionCenters(theOrganization.organizacion.id) 
        }, (error: any) => {
          this.showSnackBar('Error' + 'Ha ocurrido un error al obtener la organización' + error.message);
        })
    }

    getAllEmisionesbyYear(year:number): void {
      this.emisionesElectricasservice.getByYear(year).subscribe({
        next: (data) => {
          this.comercializadorasElectricas = data;
        },
        error: (error) => {
          console.error('Error al obtener las emisiones:', error);
        }
      });
    }

    getProductionCenters(idEmpresa: number) {
      this.productionCenterService.getCentrosDeProduccionFromOrganizacion(idEmpresa)
        .subscribe((productionCenter:any) => {
        this.dataSource = new MatTableDataSource<any>(productionCenter)
        })
    }

    getSectoresEconomicos() {
      this.sectoresEconomicos.getSectoresEconomicos()
        .subscribe((response: SectorsDTO[]) => {
          this.sectors = response
        }, (error: any) => {
          this.showSnackBar('Error' + 'Ha ocurrido un error al obtener los sectores económicos' + error.message);
        })
    }

    onSubmit() {
      if (this.organizationForm.valid) {
        this.organizationService.actualizarOrganizacion(this.organizationID, this.organizationForm.value)
        .subscribe((response: any) => { 
          console.log(response)
          this.showSnackBar('Información: '+ response.message);
        }, (error: any) => {
          this.showSnackBar('Error'+ 'Ha ocurrido un error al actualizar la organización'+error.message);
        });
      }
    }

    onMultipleOrgChange(event: MatCheckboxChange) {
      console.log(`¿Está seleccionado?: ${event.checked}`);
      const isChecked = event.checked
      if (isChecked) {
        this.organizationForm.get('multipleProductionCenter')?.setValue('1')
        this.mustShowDelegations = true
      }
      else {
        this.organizationForm.get('multipleProductionCenter')?.setValue('0')
        this.mustShowDelegations = false
      }
    }

    openDialog(title:string, info:string): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: title,
          text: info,
          position: 'center'
        },
        width: '400px',
        height: '300px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('El dialog se cerró');
      });
    }

    private showSnackBar(error: string): void {
      this.snackBar.open(error, 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar'],
      });
    }
  }