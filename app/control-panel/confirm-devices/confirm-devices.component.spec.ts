import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDevicesComponent } from './confirm-devices.component';

describe('ConfirmDevicesComponent', () => {
  let component: ConfirmDevicesComponent;
  let fixture: ComponentFixture<ConfirmDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
