import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTransfermaraerEmissionFactorMaintenanceComponent } from './fuel-transfermaraer-emission-factor-maintenance.component';

describe('FuelTransfermaraerEmissionFactorMaintenanceComponent', () => {
  let component: FuelTransfermaraerEmissionFactorMaintenanceComponent;
  let fixture: ComponentFixture<FuelTransfermaraerEmissionFactorMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuelTransfermaraerEmissionFactorMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelTransfermaraerEmissionFactorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
