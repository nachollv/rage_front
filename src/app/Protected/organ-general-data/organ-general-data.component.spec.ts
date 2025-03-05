import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganGeneralDataComponent } from './organ-general-data.component';

describe('OrganGeneralDataComponent', () => {
  let component: OrganGeneralDataComponent;
  let fixture: ComponentFixture<OrganGeneralDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganGeneralDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganGeneralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
