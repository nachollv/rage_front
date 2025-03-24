import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatSteamColdCompAirComponent } from './heat-steam-cold-comp-air.component';

describe('HeatSteamColdCompAirComponent', () => {
  let component: HeatSteamColdCompAirComponent;
  let fixture: ComponentFixture<HeatSteamColdCompAirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeatSteamColdCompAirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeatSteamColdCompAirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
