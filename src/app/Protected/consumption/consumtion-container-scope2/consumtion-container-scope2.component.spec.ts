import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumtionContainerScope2Component } from './consumtion-container-scope2.component';

describe('ConsumtionContainerScope2Component', () => {
  let component: ConsumtionContainerScope2Component;
  let fixture: ComponentFixture<ConsumtionContainerScope2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumtionContainerScope2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumtionContainerScope2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
