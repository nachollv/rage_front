import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionFactorMaintenanceComponent } from './emission-factor-maintenance.component';

describe('EmissionFactorMaintenanceComponent', () => {
  let component: EmissionFactorMaintenanceComponent;
  let fixture: ComponentFixture<EmissionFactorMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmissionFactorMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmissionFactorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
