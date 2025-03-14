import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryVehiclesComponent } from './machinery-vehicles.component';

describe('MachineryVehiclesComponent', () => {
  let component: MachineryVehiclesComponent;
  let fixture: ComponentFixture<MachineryVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MachineryVehiclesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineryVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
