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
  displayedColumns: string[] = ['delegation', 'town', 'address', 'phone', 'edit', 'delete']

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
    periodList: string[] = ['2021', '2022', '2023', '2024', '2025'];
    objectiveList: string[] = ['Reducción del consumo de energía', 'Minimizar residuos', 'Ahorro de agua', 'Disminución de Emisiones de CO2', 'Aumento del uso de energías renovables'];
    token: string = ''
    organizationID!: number
  
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
        cnae: [''],
        zipCode: [''],
        activa: [false],
        multipleProductionCenter: [false],
        email: [''],
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
    }

    getTheOrganization(id: number) {

      this.organizationService.getOrganizacion(id)
        .subscribe((theOrganization: any) => {
            
          const data = {
            id: theOrganization.id,
            cif: theOrganization.cif,
            companyName: theOrganization.companyName,
            organizationType: theOrganization.organizationType,
            cnae: theOrganization.cnae,
            zipCode:theOrganization.zipCode,
            activa: theOrganization.activa,
            multipleProductionCenter: theOrganization.multipleProductionCenter,
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

          if (theOrganization.activa === '1') {
            this.organizationForm.get('activa')?.setValue('1')
          } else {
            this.organizationForm.get('activa')?.setValue('0')
          }

        this.getProductionCenters(theOrganization.id) 
        }, (error: any) => {
          this.showSnackBar('Error' + 'Ha ocurrido un error al obtener la organización' + error.message);

        })
    }

    getProductionCenters(idEmpresa: number) {
      this.productionCenterService.getCentrosDeProduccionFromOrganizacion(idEmpresa)
        .subscribe((productionCenter:any) => {
        console.log (productionCenter)
        this.dataSource = new MatTableDataSource<any>(productionCenter)
        })
    } 

    onSubmit() { 
      if (this.organizationForm.valid) {
        this.organizationService.actualizarOrganizacion(this.organizationForm.get('id')?.value, this.organizationForm.value)
        .subscribe((response: any) => { 

          this.showSnackBar('Información'+'La organización ha sido actualizada correctamente'+response);
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

    onActivaChange(event: MatCheckboxChange) {
      console.log(`¿Está seleccionado?: ${event.checked}`);
      const isChecked = event.checked
      if (isChecked) {
        this.organizationForm.get('activa')?.setValue('1');
      }
      else {
        this.organizationForm.get('activa')?.setValue('0');
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
        duration: 1500,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar'],
      });
    }
  }