import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandResponseComponent } from './demand-response.component';

describe('DemandResponseComponent', () => {
  let component: DemandResponseComponent;
  let fixture: ComponentFixture<DemandResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
