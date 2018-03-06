import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDeviceComponent } from './add-edit-device.component';

describe('AddEditDeviceComponent', () => {
  let component: AddEditDeviceComponent;
  let fixture: ComponentFixture<AddEditDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
