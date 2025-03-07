import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedInstallationComponent } from './fixed-installation.component';

describe('FixedInstallationComponent', () => {
  let component: FixedInstallationComponent;
  let fixture: ComponentFixture<FixedInstallationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedInstallationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FixedInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
