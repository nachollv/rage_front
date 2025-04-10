import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { OrganizacionService } from '../../services/organizacion.service';
import { ProductioncenterService } from '../../services/productioncenter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  organizationTypes: { id: string, name: string }[] = [
    { id: '1', name: 'Micro' },
    { id: '2', name: 'Pequeña' },
    { id: '3', name: 'Mediana' },
    { id: '4', name: 'Gran empresa' },
    { id: '5', name: 'Administración' },
    { id: '6', name: 'Entidad sin ánimo de lucro' },
    { id: '7', name: 'Otras' }
  ];
  
    sectors: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    objectiveList: string[] = ['Reducción del consumo de energía', 'Minimizar residuos', 'Ahorro de agua', 'Disminución de Emisiones de CO2', 'Aumento del uso de energías renovables'];
    token: string = ''
    organizationID!: number
    availableYears: number[] = [];

    // Años seleccionados por el usuario
    selectedYears: { id: number, year: number }[] = [];
  
    constructor(private fb: FormBuilder, private snackBar: MatSnackBar,
      private jwtHelper: JwtHelperService,
      private authService: AuthService, private organizationService: OrganizacionService,
      private productionCenterService: ProductioncenterService,
      public dialog: MatDialog) {
      this.organizationForm = this.fb.group({
        id: [{ value: '', disabled: true }],
        cif: [''],
        companyName: [''],
        organizationType: [''],
        activityYear: [null, Validators.required],
        cnae: [''],
        zipCode: [''],
        multipleProductionCenter: [],
        email: [''],
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
      this.getTheOrganization(this.organizationID)   
      this.getTheActivityYears(this.organizationID)
    }

    getTheOrganization(id: number) {

      this.organizationService.getOrganizacion(id)
        .subscribe((theOrganization: any) => {
          console.log (theOrganization.multipleProductionCenter)
          const data = {
            id: theOrganization.id,
            cif: theOrganization.cif,
            companyName: theOrganization.companyName,
            organizationType: theOrganization.organizationType,
            cnae: theOrganization.cnae,
            zipCode:theOrganization.zipCode,
            multipleProductionCenter: theOrganization.multipleProductionCenter,
            daysPasswordDuration	: theOrganization.daysPasswordDuration,
            
            email: theOrganization.email,
            created_at: theOrganization.created_at,
            updated_at: theOrganization.updated_at,
            deleted_at: theOrganization.deleted_at,
          };
          this.organizationForm.patchValue(data);
          if (theOrganization.multipleProductionCenter === '1') {
            this.mustShowDelegations = true;
            this.organizationForm.get('multipleProductionCenter')?.setValue('1');
          } else {
            this.mustShowDelegations = false;
            this.organizationForm.get('multipleProductionCenter')?.setValue('0')
          }

        this.getProductionCenters(theOrganization.id) 
        }, (error: any) => {
          this.showSnackBar('Error' + 'Ha ocurrido un error al obtener la organización' + error.message);
        })
    }

    getTheActivityYears(id: number) {
      this.organizationService.getActivityYearsByOrganization(id).subscribe(
        (response: any) => {
        console.log(response);

        this.availableYears = [];
        for (let year = 2019; year <= 2030; year++) {
          this.availableYears.push(year);
        }
        const selectedYears = response.data.map((year: string) => +year)
        this.organizationForm.patchValue({ activityYear: selectedYears })
      },
    (error: any) => {
      this.showSnackBar('Error: ' + error.message);
    }
    );
    }

    getProductionCenters(idEmpresa: number) {
      this.productionCenterService.getCentrosDeProduccionFromOrganizacion(idEmpresa)
        .subscribe((productionCenter:any) => {
        this.dataSource = new MatTableDataSource<any>(productionCenter)
        })
    }

    onSubmit() { 
      if (this.organizationForm.valid) {
        this.organizationService.actualizarOrganizacion(this.organizationForm.get('id')?.value, this.organizationForm.value)
        .subscribe((response: any) => { 
          console.log(response)
          this.showSnackBar('Información: '+ response.message);
        }, (error: any) => {
          this.showSnackBar('Error'+ 'Ha ocurrido un error al actualizar la organización'+error.message);
        });
    }}

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