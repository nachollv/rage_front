import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityConsumptionVehiclesComponent } from './electricity-consumption-vehicles.component';

describe('ElectricityConsumptionVehiclesComponent', () => {
  let component: ElectricityConsumptionVehiclesComponent;
  let fixture: ComponentFixture<ElectricityConsumptionVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectricityConsumptionVehiclesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElectricityConsumptionVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
