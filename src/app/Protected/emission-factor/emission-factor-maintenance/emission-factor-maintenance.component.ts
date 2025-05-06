import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-emission-factor-maintenance',
  templateUrl: './emission-factor-maintenance.component.html',
  styleUrl: './emission-factor-maintenance.component.scss'
})
export class EmissionFactorMaintenanceComponent {

  selectedTabIndexFE: number = 0
  cargando:boolean = false

  constructor (
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
