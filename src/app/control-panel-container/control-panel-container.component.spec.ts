import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPanelContainerComponent } from './control-panel-container.component';

describe('ControlPanelContainerComponent', () => {
  let component: ControlPanelContainerComponent;
  let fixture: ComponentFixture<ControlPanelContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlPanelContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlPanelContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
