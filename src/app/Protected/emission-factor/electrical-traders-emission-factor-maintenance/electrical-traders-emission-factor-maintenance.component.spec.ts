import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalTradersEmissionFactorMaintenanceComponent } from './electrical-traders-emission-factor-maintenance.component';

describe('ElectricalTradersEmissionFactorMaintenanceComponent', () => {
  let component: ElectricalTradersEmissionFactorMaintenanceComponent;
  let fixture: ComponentFixture<ElectricalTradersEmissionFactorMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectricalTradersEmissionFactorMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElectricalTradersEmissionFactorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
