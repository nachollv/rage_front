import { Component, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DialogService } from '../../../services/dialog.service';

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
  cargando:boolean = false

  constructor (private dialogService: DialogService) { }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope1')
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope1 = +savedTabIndex;
    }
  }

  onTabChange(index: number) {
    localStorage.setItem('selectedTabIndexscope1', index.toString());
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
