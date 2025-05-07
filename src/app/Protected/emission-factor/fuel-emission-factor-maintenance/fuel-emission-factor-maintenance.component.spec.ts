import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEmissionFactorMaintenanceComponent } from './fuel-emission-factor-maintenance.component';

describe('FuelEmissionFactorMaintenanceComponent', () => {
  let component: FuelEmissionFactorMaintenanceComponent;
  let fixture: ComponentFixture<FuelEmissionFactorMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuelEmissionFactorMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelEmissionFactorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
