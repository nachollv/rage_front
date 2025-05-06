import { Component, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-consumtion-container-scope2',
  templateUrl: './consumtion-container-scope2.component.html',
  styleUrl: './consumtion-container-scope2.component.scss'
})
export class ConsumtionContainerScope2Component {
  @Input() activityYear: number = 0
  @Input() productionCenter: number = 0
  selectedTabIndexscope2: number = 0;
  cargando:boolean = false
  
  constructor (private dialogService: DialogService) {  }

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndexscope2')
    if (savedTabIndex !== null) {
      this.selectedTabIndexscope2 = +savedTabIndex;
    }
  }

  onTabChange(index: number) {
    localStorage.setItem('selectedTabIndexscope2', index.toString());
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
