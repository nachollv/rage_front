import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEmissionFactorMaintenanceComponent } from './vehicle-emission-factor-maintenance.component';

describe('VehicleEmissionFactorMaintenanceComponent', () => {
  let component: VehicleEmissionFactorMaintenanceComponent;
  let fixture: ComponentFixture<VehicleEmissionFactorMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleEmissionFactorMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleEmissionFactorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
