import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSavingComponent } from './total-saving.component';

describe('TotalSavingComponent', () => {
  let component: TotalSavingComponent;
  let fixture: ComponentFixture<TotalSavingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalSavingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
