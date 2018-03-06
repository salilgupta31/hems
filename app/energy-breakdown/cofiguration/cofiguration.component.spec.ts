import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CofigurationComponent } from './cofiguration.component';

describe('CofigurationComponent', () => {
  let component: CofigurationComponent;
  let fixture: ComponentFixture<CofigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CofigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CofigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
