import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailSeaAirtransportComponent } from './rail-sea-airtransport.component';

describe('RailSeaAirtransportComponent', () => {
  let component: RailSeaAirtransportComponent;
  let fixture: ComponentFixture<RailSeaAirtransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RailSeaAirtransportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RailSeaAirtransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
