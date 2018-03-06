import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageChangeComponent } from './package-change.component';

describe('PackageChangeComponent', () => {
  let component: PackageChangeComponent;
  let fixture: ComponentFixture<PackageChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
