import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyBreakdownComponent } from './energy-breakdown.component';

describe('EnergyBreakdownComponent', () => {
  let component: EnergyBreakdownComponent;
  let fixture: ComponentFixture<EnergyBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
