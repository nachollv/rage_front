import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaquingsByProductionCenterComponent } from './raquings-by-production-center.component';

describe('RaquingsByProductionCenterComponent', () => {
  let component: RaquingsByProductionCenterComponent;
  let fixture: ComponentFixture<RaquingsByProductionCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaquingsByProductionCenterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaquingsByProductionCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
