import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryEmissionFactorMaintenanceComponent } from './machinery-emission-factor-maintenance.component';

describe('MachineryEmissionFactorMaintenanceComponent', () => {
  let component: MachineryEmissionFactorMaintenanceComponent;
  let fixture: ComponentFixture<MachineryEmissionFactorMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MachineryEmissionFactorMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineryEmissionFactorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
