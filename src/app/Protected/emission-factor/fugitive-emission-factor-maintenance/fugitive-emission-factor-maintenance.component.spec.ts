import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FugitiveEmissionFactorMaintenanceComponent } from './fugitive-emission-factor-maintenance.component';

describe('FugitiveEmissionFactorMaintenanceComponent', () => {
  let component: FugitiveEmissionFactorMaintenanceComponent;
  let fixture: ComponentFixture<FugitiveEmissionFactorMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FugitiveEmissionFactorMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FugitiveEmissionFactorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
