import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardPenalityComponent } from './reward-penality.component';

describe('RewardPenalityComponent', () => {
  let component: RewardPenalityComponent;
  let fixture: ComponentFixture<RewardPenalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardPenalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardPenalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
