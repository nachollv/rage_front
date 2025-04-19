import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumtionContainerScope1Component } from './consumtion-container-scope1.component';

describe('ConsumtionContainerScope1Component', () => {
  let component: ConsumtionContainerScope1Component;
  let fixture: ComponentFixture<ConsumtionContainerScope1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumtionContainerScope1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumtionContainerScope1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
