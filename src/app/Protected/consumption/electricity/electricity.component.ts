import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-electricity',
  templateUrl: './electricity.component.html',
  styleUrl: './electricity.component.scss'
})
export class ElectricityComponent implements OnInit, OnChanges {
  @Input() activityYear!: number
  @Input() productionCenter: number = 0

  displayedColumns: string[] = ['year', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'delete']
  data = [
    { delegation: 'Central', year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true},
    { delegation: 'Felanitx', year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },
    { delegation: 'Manacor', year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },  
    { delegation: 'Calvià', year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: false, delete: true },
    { delegation: 'Andraitx', year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true },
    { delegation: 'Pollença', year: 2024, '01': 25, '02': 34.25, '03': '23.54', '04': 45.345, '05': 45.345, '06': 45.345, '07': 45.345, '08': 45.345, '09': 45.345, '10': 45.345, '11': 45.345, edit: true, delete: true }
  ];
  dataSource = new MatTableDataSource<any>(this.data)
  buildingElecConsumption!: FormGroup;
  
    constructor(private fb: FormBuilder, public dialog: MatDialog) {

    }

    
    ngOnInit(): void {
      this.buildingElecConsumption = this.fb.group({
        productionCenter: [{ value: 2, disabled: true }],
        activityYear: [{ value: 2025, disabled: true }],
        periodoFactura: ['mensual', Validators.required],
        consumos: this.fb.group({
        comercializadora: ['', [Validators.required]],
        activityData: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
        gdo: ['', [Validators.required]]
        })
      });

      /* this.getFuelConsumptions(this.activityYear)
      this.getScopeOneRecords(this.activityYear, this.productionCenter) */
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['activityYear'] && !changes['activityYear'].firstChange) {
       /*  this.getFuelConsumptions(this.activityYear); */
      }
    }
  
    onSubmit() {
      if (this.buildingElecConsumption.valid) {
        console.log(this.buildingElecConsumption.value);
      }
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            title: 'Título del Dialog',
            text: 'Este es el texto del Dialog.',
            position: 'center'
          },
          /* position: { top: '20%', left: '20%' } ,*/ // Ajusta la posición según tus necesidades
          width: '400px',
          height: '300px'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('El dialog se cerró');
        });
      }
  }
  
