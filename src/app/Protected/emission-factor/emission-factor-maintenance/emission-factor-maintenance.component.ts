import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { AuxTextDTO } from '../../../models/auxText.dto';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-emission-factor-maintenance',
  templateUrl: './emission-factor-maintenance.component.html',
  styleUrl: './emission-factor-maintenance.component.scss'
})
export class EmissionFactorMaintenanceComponent {
  auxText: AuxTextDTO | undefined
  title: string = ''
  text: string = ''
  selectedTabIndexFE: number = 0
  cargando:boolean = false

  constructor (public dialog: MatDialog,
    private dialogService: DialogService) { }

    ngOnInit() {
      const savedTabIndex = localStorage.getItem('selectedTabIndexFE')
      if (savedTabIndex !== null) {
        this.selectedTabIndexFE = +savedTabIndex;
      }
    }    

    onTabChange(index: number) {
      localStorage.setItem('selectedTabIndexFE', index.toString());
    }

    openDialog(id: number): void {
      this.cargando = true;
      this.dialogService.openDialog(id).pipe(
        finalize(() => {
          this.cargando = false;
        })
      ).subscribe();
    }

}
