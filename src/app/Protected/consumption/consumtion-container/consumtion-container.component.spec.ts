import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumtionContainerComponent } from './consumtion-container.component';

describe('ConsumtionContainerComponent', () => {
  let component: ConsumtionContainerComponent;
  let fixture: ComponentFixture<ConsumtionContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumtionContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumtionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
