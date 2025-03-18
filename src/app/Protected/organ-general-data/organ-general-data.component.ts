import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { OrganizacionService } from '../../services/organizacion.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-organ-general-data',
  templateUrl: './organ-general-data.component.html',
  styleUrl: './organ-general-data.component.scss'
})
export class OrganGeneralDataComponent implements OnInit {
  mustShowDelegations: boolean = false
  displayedColumns: string[] = ['delegation', 'town', 'address', 'phone', 'edit', 'delete']
  data = [
    { delegation: 'Central', town: 'Palma', address: '123 Main St', phone: '971971971', edit: true, delete: true},
    { delegation: 'Sede Felanitx', town: 'Felanitx', address: '456 Maple Ave', phone: '971971971', edit: true, delete: true },
    { delegation: 'Sede Manacor', town: 'Manacor', address: '789 Oak Dr', phone: '971971971', edit: true, delete: true },  
    { delegation: 'Sede Calvià', town: 'Calvià', address: '123 Main St', phone: '971971971', edit: false, delete: true },
    { delegation: 'Sede Andraitx', town: 'Andraitx', address: '456 Maple Ave', phone: '971971971', edit: true, delete: true },
    { delegation: 'Sede Pollença', town: 'Pollença', address: '789 Oak Dr', phone: '971971971', edit: true, delete: true }
  ];
  dataSource = new MatTableDataSource<any>(this.data)
  organizationForm: FormGroup
  organizationTypes: { id: number, name: string }[] = [
    { id: 1, name: 'Micro' },
    { id: 2, name: 'Pequeña' },
    { id: 3, name: 'Mediana' },
    { id: 4, name: 'Gran empresa' },
    { id: 5, name: 'Administración' },
    { id: 6, name: 'Entidad sin ánimo de lucro' },
    { id: 7, name: 'Otras' }
  ];
  
    sectors: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    periodList: string[] = ['2021', '2022', '2023', '2024', '2025'];
    objectiveList: string[] = ['Reducción del consumo de energía', 'Minimizar residuos', 'Ahorro de agua', 'Disminución de Emisiones de CO2', 'Aumento del uso de energías renovables'];
    token: string = ''
    organizationID: string = ''
  
    constructor(private fb: FormBuilder,
      private jwtHelper: JwtHelperService,
      private authService: AuthService, private organizationService: OrganizacionService,
      public dialog: MatDialog) {
      this.organizationForm = this.fb.group({
        id: [{ value: '', disabled: true }],
        cif: [''],
        companyName: [''],
        organizationType: [''],
        cnae: [''],
        zipCode: [''],
        activa: [''],
        multipleProductionCenter: [''],
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

    getTheOrganization(id: string) {

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
          console.log (data)
          this.organizationForm.patchValue(data);
        })
      
    
    }
  
    onSubmit() {
      this.organizationForm.patchValue({
        multicenter: false
      });
      if (this.organizationForm.valid) {
        console.log(this.organizationForm.value);
      }
    }

    onSelectionChange(event: any) {
      const selectedValue = event.checked;
      this.mustShowDelegations = selectedValue;
      console.log('Selected value:', selectedValue);
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
  }