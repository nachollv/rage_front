import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeakageRefrigerantGasesComponent } from './leakage-refrigerant-gases.component';

describe('LeakageRefrigerantGasesComponent', () => {
  let component: LeakageRefrigerantGasesComponent;
  let fixture: ComponentFixture<LeakageRefrigerantGasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeakageRefrigerantGasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeakageRefrigerantGasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
