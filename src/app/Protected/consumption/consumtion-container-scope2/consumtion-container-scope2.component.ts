import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductioncenterService } from '../../../services/productioncenter.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-consumtion-container-scope2',
  templateUrl: './consumtion-container-scope2.component.html',
  styleUrl: './consumtion-container-scope2.component.scss'
})
export class ConsumtionContainerScope2Component {
  selectedTabIndexscope2: number = 0;
  productionCenterForm: FormGroup;
  token: string = ''
  prodCenterID!: number

  constructor(public dialog: MatDialog, private productionCenterService: ProductioncenterService,
     private jwtHelper: JwtHelperService,
  ) {
    this.productionCenterForm = new FormBuilder().group({
      calculationYear: [{ value: '2023', disabled: true }],
      productionCenter: [{ value: '2', disabled: true }],
    });
  }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1')
    this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.idCentroProduccion
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

  openDialog(title:string, text: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        text: text,
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
